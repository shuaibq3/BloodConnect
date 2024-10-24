import { GENERIC_CODES } from '../../../commons/libs/constants/GenericCodes'
import BloodDonationOperationError from './BloodDonationOperationError'
import { DonationDTO, DonationStatus } from '../../../commons/dto/DonationDTO'
import { generateUniqueID } from '../utils/idGenerator'
import Repository from '../technicalImpl/policies/repositories/Repository'
import { generateGeohash } from '../utils/geohash'
import { validateInputWithRules } from '../utils/validator'
import { BloodDonationAttributes, validationRules, UpdateBloodDonationAttributes } from './Types'
import { BLOOD_REQUEST_PK_PREFIX } from '../technicalImpl/dbModels/BloodDonationModel'

export class BloodDonationService {
  async createBloodDonation(donationAttributes: BloodDonationAttributes, bloodDonationRepository: Repository<DonationDTO>): Promise<string> {
    try {
      const validationResponse = validateInputWithRules({ bloodQuantity: donationAttributes.bloodQuantity, donationDateTime: donationAttributes.donationDateTime }, validationRules)
      console.log('validationResponse', validationResponse)
      if (validationResponse !== null) {
        console.log('IF validationResponse', validationResponse)
        throw new Error(validationResponse)
      }
      await bloodDonationRepository.create({
        id: generateUniqueID(),
        ...donationAttributes,
        status: DonationStatus.PENDING,
        geohash: generateGeohash(donationAttributes.latitude, donationAttributes.longitude),
        donationDateTime: new Date(donationAttributes.donationDateTime).toISOString()
      })
      console.log('AFTER')
      return 'We have accepted your request, and we will let you know when we find a donor.'
    } catch (error) {
      console.log('Service Catch', error)
      throw new BloodDonationOperationError(`${error}`, GENERIC_CODES.ERROR)
    }
  }

  async updateBloodDonation(donationAttributes: UpdateBloodDonationAttributes, bloodDonationRepository: Repository<DonationDTO>): Promise<string> {
    try {
      const { requestPostId, donationDateTime, ...restAttributes } = donationAttributes

      const item = await bloodDonationRepository.getItem(`${BLOOD_REQUEST_PK_PREFIX}#${donationAttributes.seekerId}`, `${BLOOD_REQUEST_PK_PREFIX}#${requestPostId}`)
      if (item === null) {
        throw new Error('Item not found.')
      }
      if (item?.status !== undefined && item.status === DonationStatus.COMPLETED) {
        throw new Error('You can\'t update a completed request')
      }
      const updateData: Partial<DonationDTO> = {
        ...restAttributes,
        id: requestPostId
      }
      if (donationDateTime !== undefined) {
        updateData.donationDateTime = new Date(donationDateTime).toISOString()
        const validationResponse = validateInputWithRules({ donationDateTime }, validationRules)
        if (validationResponse !== null) {
          throw new Error(validationResponse)
        }
      }
      await bloodDonationRepository.update(updateData)
      return 'We have updated your request and will let you know once there is an update.'
    } catch (error) {
      throw new BloodDonationOperationError(`${error}`, GENERIC_CODES.ERROR)
    }
  }
}
