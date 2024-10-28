import { StepFunctionExecutionAttributes, StepFunctionInput } from '../../bloodDonationWorkflow/Types'

export const startExecutionInputMock: StepFunctionInput = {
  seekerId: 'seeker123',
  requestPostId: 'req123',
  neededBloodGroup: 'O-' as const,
  bloodQuantity: 2,
  urgencyLevel: 'urgent' as const,
  donationDateTime: '2024-10-20T15:00:00Z',
  geohash: 'wvjytdh'
}

export const startExecutionOutputMock: StepFunctionExecutionAttributes = {
  executionArn: 'arn:aws:states:us-east-1:123456789012:execution:donorRouting:execution-id-123',
  status: 'RUNNING',
  startDate: '2024-10-10T00:00:00Z',
  input: startExecutionInputMock
}
