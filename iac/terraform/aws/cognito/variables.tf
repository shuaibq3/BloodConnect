variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "bloodconnect_domain" {
  type = string
}

variable "lambda_runtime" {
  type        = string
  description = "Lambda Runtime"
  default     = "nodejs20.x"
}

variable "verified_domain_arn" {
  type = string
}

variable "dynamodb_table_arn" {
  type = string
}

variable "password_length" {
  type    = number
  default = 10
}
