import { SQSEvent } from 'aws-lambda'
import donorRequestRouter from '../../bloodDonation/donorRequestRouter'
import { BloodDonationService } from '../../../../application/bloodDonationWorkflow/BloodDonationService'
import StepFunctionOperations from '../../commons/stepFunction/StepFunctionOperations'
import { donorRoutingAttributesMock } from '../../../../application/tests/mocks/mockDonationRequestData'

jest.mock('../../../../application/bloodDonationWorkflow/BloodDonationService')
jest.mock('../../commons/stepFunction/StepFunctionOperations')

describe('donorRequestRouter', () => {
  const mockEvent: SQSEvent = {
    Records: [
      {
        messageId: '1',
        receiptHandle: '1',
        body: JSON.stringify({
          seekerId: donorRoutingAttributesMock.seekerId,
          requestPostId: donorRoutingAttributesMock.requestPostId
        }),
        attributes: {
          ApproximateReceiveCount: '',
          SentTimestamp: '',
          SenderId: '',
          ApproximateFirstReceiveTimestamp: ''
        },
        messageAttributes: {},
        md5OfBody: 'md5',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:region:123456789012:queue',
        awsRegion: 'region'
      }
    ]
  }

  let mockBloodDonationService: jest.MockedClass<typeof BloodDonationService>

  beforeEach(() => {
    mockBloodDonationService = BloodDonationService as jest.MockedClass<typeof BloodDonationService>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should process all records in the SQSEvent', async() => {
    const mockResponse = 'Blood donation created successfully'
    mockBloodDonationService.prototype.routeDonorRequest.mockResolvedValue(mockResponse)

    await donorRequestRouter(mockEvent)

    expect(mockBloodDonationService.prototype.routeDonorRequest).toHaveBeenCalledTimes(mockEvent.Records.length)
    expect(mockBloodDonationService.prototype.routeDonorRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        seekerId: donorRoutingAttributesMock.seekerId,
        requestPostId: donorRoutingAttributesMock.requestPostId
      }),
      expect.anything(),
      expect.any(StepFunctionOperations)
    )
  })

  it('should handle invalid JSON in the SQS message body', async() => {
    const invalidEvent: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: '1',
          body: '{ invalid json }',
          attributes: {
            ApproximateReceiveCount: '',
            SentTimestamp: '',
            SenderId: '',
            ApproximateFirstReceiveTimestamp: ''
          },
          messageAttributes: {},
          md5OfBody: 'md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:region:123456789012:queue',
          awsRegion: 'region'
        }
      ]
    }

    await expect(donorRequestRouter(invalidEvent)).rejects.toThrow("Expected property name or '}' in JSON at position 2")
    expect(mockBloodDonationService.prototype.routeDonorRequest).not.toHaveBeenCalled()
  })

  it('should throw an error if routeDonorRequest fails', async() => {
    const errorMessage = 'Failed to route donor request'
    mockBloodDonationService.prototype.routeDonorRequest.mockRejectedValue(new Error(errorMessage))

    await expect(donorRequestRouter(mockEvent)).rejects.toThrow(errorMessage)
    expect(mockBloodDonationService.prototype.routeDonorRequest).toHaveBeenCalled()
  })
})
