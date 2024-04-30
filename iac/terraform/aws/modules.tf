module "auth" {
  source                  = "./auth"
  environment             = var.environment
  api_gw_rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  api_gw_root_resource_id = aws_api_gateway_rest_api.rest_api.root_resource_id
}
