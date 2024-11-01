variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "dynamodb_table_stream_arn" {
  type        = string
  description = "ARN of the DynamoDB table stream"
}

variable "donor_search_queue_arn" {
  type        = string
  description = "ARN of the donor search SQS queue"
}
