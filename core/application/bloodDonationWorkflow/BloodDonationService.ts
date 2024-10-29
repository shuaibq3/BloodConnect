import { GENERIC_CODES } from '../../../commons/libs/constants/GenericCodes'
import BloodDonationOperationError from './BloodDonationOperationError'
import ThrottlingError from './ThrottlingError'
import { DonationDTO, DonationStatus } from '../../../commons/dto/DonationDTO'
import { generateUniqueID } from '../utils/idGenerator'
import Repository from '../technicalImpl/policies/repositories/Repository'
import { generateGeohash } from '../utils/geohash'
import { validateInputWithRules } from '../utils/validator'
import { BLOOD_REQUEST_PK_PREFIX, BloodDonationModel, DonationFields } from '../technicalImpl/dbModels/BloodDonationModel'
import { QueryConditionOperator, QueryInput } from '../technicalImpl/policies/repositories/QueryTypes'
import { BloodDonationAttributes, validationRules, UpdateBloodDonationAttributes, DonorRoutingAttributes, StepFunctionInput } from './Types'
import { StepFunctionModel } from '../technicalImpl/stepFunctions/StepFunctionModel'

export class BloodDonationService {
  async createBloodDonation(donationAttributes: BloodDonationAttributes, bloodDonationRepository: Repository<DonationDTO, DonationFields>, model: BloodDonationModel): Promise<string> {
    try {
      await this.checkDailyRequestThrottling(donationAttributes.seekerId, bloodDonationRepository, model)

      const validationResponse = validateInputWithRules(
        { bloodQuantity: donationAttributes.bloodQuantity, donationDateTime: donationAttributes.donationDateTime },
        validationRules
      )
      if (validationResponse !== null) {
        return validationResponse
      }

      await bloodDonationRepository.create({
        id: generateUniqueID(),
        ...donationAttributes,
        status: DonationStatus.PENDING,
        geohash: generateGeohash(donationAttributes.latitude, donationAttributes.longitude),
        donationDateTime: new Date(donationAttributes.donationDateTime).toISOString()
      })
      return 'We have accepted your request, and we will let you know when we find a donor.'
    } catch (error) {
      if (error instanceof ThrottlingError) {
        throw error
      }
      throw new BloodDonationOperationError(
        `Failed to submit blood donation request. Error: ${error}`,
        GENERIC_CODES.ERROR
      )
    }
  }

  private async checkDailyRequestThrottling(seekerId: string, repository: Repository<DonationDTO, DonationFields>, model: BloodDonationModel): Promise<void> {
    const maxPostRequestPerDay = 10
    const datePrefix = new Date().toISOString().split('T')[0]
    const primaryIndex = model.getPrimaryIndex()

    const query: QueryInput<DonationFields> = {
      partitionKeyCondition: {
        attributeName: primaryIndex.partitionKey,
        operator: QueryConditionOperator.EQUALS,
        attributeValue: `${BLOOD_REQUEST_PK_PREFIX}#${seekerId}`
      }
    }

    if (primaryIndex.sortKey != null) {
      query.sortKeyCondition = {
        attributeName: primaryIndex.sortKey,
        operator: QueryConditionOperator.BEGINS_WITH,
        attributeValue: `${BLOOD_REQUEST_PK_PREFIX}#${datePrefix}`
      }
    }

    try {
      const queryResult = await repository.query(query)
      if (queryResult.items.length >= maxPostRequestPerDay) {
        throw new ThrottlingError(
          `You've reached today's limit of ${maxPostRequestPerDay} requests. Please try tomorrow.`,
          GENERIC_CODES.TOO_MANY_REQUESTS
        )
      }
    } catch (error) {
      if (error instanceof ThrottlingError) {
        throw error
      }
      throw new BloodDonationOperationError(`Failed to check request limits: ${error}`, GENERIC_CODES.ERROR)
    }
  }

  async updateBloodDonation(donationAttributes: UpdateBloodDonationAttributes, bloodDonationRepository: Repository<DonationDTO>): Promise<string> {
    try {
      const { requestPostId, donationDateTime, createdAt, ...restAttributes } = donationAttributes

      const item = await bloodDonationRepository.getItem(
        `${BLOOD_REQUEST_PK_PREFIX}#${donationAttributes.seekerId}`,
        `${BLOOD_REQUEST_PK_PREFIX}#${createdAt}#${requestPostId}`
      )

      if (item === null) {
        return 'Item not found.'
      }

      if (item?.status !== undefined && item.status === DonationStatus.COMPLETED) {
        return 'You can\'t update a completed request'
      }

      const updateData: Partial<DonationDTO> = {
        ...restAttributes,
        id: requestPostId,
        createdAt
      }

      if (donationDateTime !== undefined) {
        const validationResponse = validateInputWithRules({ donationDateTime }, validationRules)
        if (validationResponse !== null) {
          return validationResponse
        }
        updateData.donationDateTime = new Date(donationDateTime).toISOString()
      }

      await bloodDonationRepository.update(updateData)
      return 'We have updated your request and will let you know once there is an update.'
    } catch (error) {
      if (error instanceof BloodDonationOperationError) {
        throw error
      }
      throw new BloodDonationOperationError(
        `Failed to update blood donation post. Error: ${error}`,
        GENERIC_CODES.ERROR
      )
    }
  }

  async routeDonorRequest(
    donorRoutingAttributes: DonorRoutingAttributes,
    bloodDonationRepository: Repository<DonationDTO>,
    stepFunctionModel: StepFunctionModel
  ): Promise<string> {
    try {
      const { seekerId, requestPostId } = donorRoutingAttributes

      const existingItem = await bloodDonationRepository.getItem(`${BLOOD_REQUEST_PK_PREFIX}#${seekerId}`, `${BLOOD_REQUEST_PK_PREFIX}#${requestPostId}`)
      if (existingItem === null) {
        return 'Item not found.'
      }
      if (existingItem.status === DonationStatus.COMPLETED || existingItem.status === DonationStatus.EXPIRED) {
        return 'You can\'t update the donation request'
      }

      const retryCount = existingItem?.retryCount ?? 0
      const updateData: Partial<DonationDTO> = {
        ...existingItem,
        id: requestPostId,
        retryCount: retryCount + 1
      }

      if (retryCount >= Number(process.env.MAX_RETRY_COUNT)) {
        updateData.status = DonationStatus.EXPIRED
        await bloodDonationRepository.update(updateData)
        return 'The donor search process expired after the maximum retry limit is reached.'
      }

      await bloodDonationRepository.update(updateData)

      const stepFunctionInput: StepFunctionInput = {
        seekerId: donorRoutingAttributes.seekerId,
        requestPostId: donorRoutingAttributes.requestPostId,
        neededBloodGroup: existingItem.neededBloodGroup,
        bloodQuantity: existingItem.bloodQuantity,
        urgencyLevel: existingItem.urgencyLevel,
        latitude: existingItem.latitude,
        longitude: existingItem.longitude
      }

      await stepFunctionModel.startExecution(stepFunctionInput)
      return 'We have updated your request and initiated the donor search process.'
    } catch (error) {
      throw new BloodDonationOperationError(`Failed to update blood donation post. Error: ${error}`, GENERIC_CODES.ERROR)
    }
  }
}
