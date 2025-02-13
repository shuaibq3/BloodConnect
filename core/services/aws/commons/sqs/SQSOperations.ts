import { ChangeMessageVisibilityCommand, SQS } from '@aws-sdk/client-sqs'
import { QueueModel } from '../../../../application/models/queue/QueueModel'
import { DTO } from 'commons/dto/DTOCommon'

export default class SQSOperations implements QueueModel {
  private readonly client: SQS

  constructor() {
    this.client = new SQS({ region: process.env.AWS_REGION })
  }

  async queue(messageBody: DTO, queueUrl: string, delaySeconds?: number): Promise<void> {
    await this.client.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
      ...(delaySeconds !== undefined ? { DelaySeconds: delaySeconds } : {})
    })
  }

  async updateVisibilityTimeout(
    receiptHandle: string,
    queueUrl: string,
    VisibilityTimeout: number
  ): Promise<void> {
    await this.client.send(
      new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: Number(VisibilityTimeout)
      })
    )
  }
}
