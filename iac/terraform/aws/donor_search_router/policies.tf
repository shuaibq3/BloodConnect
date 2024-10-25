locals {
  policies = {
    common_policies = [
      {
        sid = "LogPolicy"
        actions = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        resources = [
          "arn:aws:logs:*:*:*"
        ]
      }
    ],
    dynamodb_policy = [
      {
        sid = "DynamodbPolicy"
        actions = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query"
        ]
        resources = [var.dynamodb_table_arn]
      }
    ],
    sfn_policy = [
      {
        sid = "StepFunctionPolicy"
        actions = [
          "states:StartExecution"
        ]
        resources = [var.donor_search_sf_arn]
      }
    ],
    sqs_policy = [
      {
        sid = "SqsPolicy"
        actions = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        resources = [
          aws_sqs_queue.donor_search_queue.arn,
          aws_sqs_queue.donor_search_retry_queue.arn
        ]
      }
    ]
  }
}
