variable "environment" {
  type        = string
  description = "Deployment environment"
}

variable "base_domain_name" {
  description = "The domain name for the web client"
  type        = string
  default     = "bloodconnect.net"
}

variable "cloudfront_response_policy_id" {
  description = "Cloudfront Managed response header policy id for CORS policy"
  type        = string
  default     = "5cc3b908-e619-4b99-88e5-2cf7f45965bd"
}
