resource "null_resource" "run_update_and_import_open_api_script" {
  provisioner "local-exec" {
    environment = {
      ACCOUNT_ID          = data.aws_caller_identity.current.account_id
      AWS_REGION          = data.aws_region.current.name
      ENVIRONMENT         = var.environment
      API_GATEWAY_ID      = aws_api_gateway_rest_api.rest_api.id
      OPENAPI_DIRECTORY   = var.openapi_directory
      API_VERSION         = var.openapi_version
      COMBINED_OPENAPI_FILE = var.combined_openapi_file
    }
    command = "${path.module}/scripts/import-openapi.sh"
  }

  depends_on = [
    aws_api_gateway_rest_api.rest_api
  ]

  triggers = {
    always_run = "${timestamp()}"
  }
}
