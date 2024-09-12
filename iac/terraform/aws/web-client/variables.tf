locals {
  api_subdomain_name = "api.${var.domain_name}"
  www_domain = "www.${var.domain_name}"
}

variable "bucket_name" {
  description = "S3 bucket name to store the static website"
  type        = string
  default = "blood-connect-application"
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN to use for HTTPS in CloudFront and API Gateway"
  type        = string
}

variable "domain_name" {
  description = "The domain name for the web client"
  type        = string
  default = "bloodconnect.net"
}
