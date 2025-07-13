variable "project_id"     { type = string }
variable "region"         { type = string }
variable "app_name"       { type = string }
variable "build_dir"      { type = string }
variable "cloudflare_api_token" { type = string }
variable "env_vars" {
  type        = string
  description = "Environment variables as JSON string"
  default     = "{}"
}

data "external" "api_services" {
  program = ["sh", "-c", <<-EOF
    cd "${path.module}/.." && \
    services=$(find . -maxdepth 1 -type d -name "*-api" | \
    sed 's|^./||' | \
    sed 's|-api$||' | \
    tr '\n' ',' | \
    sed 's/,$//')
    echo "{\"services\": \"$services\"}"
  EOF
  ]
}

locals {
  # Dynamically discover API services from infra directory structure
  # This will automatically pick up any new *-api directories
  expected_api_services = data.external.api_services.result.services

  # Environment variables for the gateway container
  gateway_env_vars = {
    PROJECT_ID = var.project_id
    REGION     = var.region
    # Pass the discovered API services to the gateway
    EXPECTED_API_SERVICES = local.expected_api_services
  }
  parsed_env_vars = jsondecode(var.env_vars)
}
