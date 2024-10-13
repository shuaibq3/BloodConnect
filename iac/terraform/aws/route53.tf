data "aws_route53_zone" "main" {
  #checkov:skip=CKV2_AWS_39: "Ensure Domain Name System (DNS) query logging is enabled for Amazon Route 53 hosted zones"
  #checkov:skip=CKV2_AWS_38: "Ensure Domain Name System Security Extensions (DNSSEC) signing is enabled for Amazon Route 53 public hosted zones"
  name         = var.bloodconnect_domain
  private_zone = false
}

resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.bloodconnect_domain
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_cdn_domain_name
    zone_id                = module.cloudfront.cloudfront_cdn_hosted_zone_id
    evaluate_target_health = false
  }
}
