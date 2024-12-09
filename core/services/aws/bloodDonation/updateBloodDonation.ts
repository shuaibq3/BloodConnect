import { APIGatewayProxyResult } from 'aws-lambda'
import { HTTP_CODES } from '../../../../commons/libs/constants/GenericCodes'
import generateApiGatewayResponse from '../commons/lambda/ApiGateway'
import { BloodDonationService } from '../../../application/bloodDonationWorkflow/BloodDonationService'
import { NotificationService } from '../../../application/notificationWorkflow/NotificationService'
import { UpdateBloodDonationAttributes } from '../../../application/bloodDonationWorkflow/Types'
import { DonationDTO } from '../../../../commons/dto/DonationDTO'
import { BloodDonationNotificationDTO } from '../../../../commons/dto/NotificationDTO'
import {
  BloodDonationModel,
  DonationFields
} from '../../../application/models/dbModels/BloodDonationModel'
import BloodDonationDynamoDbOperations from '../commons/ddb/BloodDonationDynamoDbOperations'
import NotificationDynamoDbOperations from '../commons/ddb/NotificationDynamoDbOperations'
import { BloodDonationPayloadAttributes } from '../../../application/notificationWorkflow/Types'
import DonationNotificationModel, {
  BloodDonationNotificationFields
} from '../../..//application/models/dbModels/DonationNotificationModel'

const allowedKeys: Array<keyof UpdateBloodDonationAttributes> = [
  'bloodQuantity',
  'urgencyLevel',
  'donationDateTime',
  'contactNumber',
  'patientName',
  'transportationInfo',
  'shortDescription',
  'createdAt'
]

type RequiredAttributes = Pick<
UpdateBloodDonationAttributes,
'requestPostId' | 'seekerId' | 'createdAt'
>
type OptionalAttributes = Partial<Omit<UpdateBloodDonationAttributes, 'requestPostId' | 'seekerId'>>

const bloodDonationService = new BloodDonationService()
const notificationService = new NotificationService()

async function updateBloodDonationLambda(
  event: UpdateBloodDonationAttributes
): Promise<APIGatewayProxyResult> {
  try {
    const bloodDonationAttributes: RequiredAttributes & OptionalAttributes = {
      requestPostId: event.requestPostId,
      seekerId: event.seekerId,
      createdAt: event.createdAt,
      ...Object.fromEntries(
        Object.entries(event)
          .filter(([key]) => allowedKeys.includes(key as keyof UpdateBloodDonationAttributes))
          .filter(([_, value]) => value !== undefined && value !== '')
      )
    }
    const response = await bloodDonationService.updateBloodDonation(
      bloodDonationAttributes,
      new BloodDonationDynamoDbOperations<DonationDTO, DonationFields, BloodDonationModel>(
        new BloodDonationModel()
      )
    )

    await notificationService.updateBloodDonationNotifications(
      event.requestPostId,
      bloodDonationAttributes as Partial<BloodDonationPayloadAttributes>,
      new NotificationDynamoDbOperations<
      BloodDonationNotificationDTO,
      BloodDonationNotificationFields,
      DonationNotificationModel
      >(new DonationNotificationModel())
    )
    return generateApiGatewayResponse({ message: response }, HTTP_CODES.OK)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return generateApiGatewayResponse(`Error: ${errorMessage}`, HTTP_CODES.ERROR)
  }
}

export default updateBloodDonationLambda
