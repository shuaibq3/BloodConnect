/* eslint-disable no-console */
import { SQSEvent, SQSHandler } from 'aws-lambda'
import { SNS } from '@aws-sdk/client-sns'
import { NotificationQueueMessage } from '../../../../commons/dto/NotificationDTO'

const sns = new SNS({})

export const handler: SQSHandler = async(event: SQSEvent) => {
  const failedMessageIds: string[] = []

  for (const record of event.Records) {
    // try {
    const message = JSON.parse(record.body) as NotificationQueueMessage

    // Send to SNS topic
    await sns.publish({
      TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
      Message: JSON.stringify({
        default: JSON.stringify(message.payload),
        GCM: JSON.stringify({
          data: {
            ...message.payload,
            deviceToken: message.deviceToken
          }
        })
      }),
      MessageStructure: 'json'
    })

    console.log('l2-sns')
    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.error('Error processing message:', error)
    //   failedMessageIds.push(record.messageId)
    //   // Message will be moved to DLQ after max retries
    // }
  }

  if (failedMessageIds.length > 0) {
    throw new Error(`Failed to process messages: ${failedMessageIds.join(', ')}`)
  }
}
