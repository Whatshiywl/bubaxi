module "cloud_run" {
  source          = "../modules/cloud-run"
  project_id      = var.project_id
  app_name        = var.app_name
  region          = var.region
  build_dir       = var.build_dir
  map_domain      = true
  domain_prefix   = "api"
  env_vars        = local.gateway_env_vars
  providers = {
    cloudflare = cloudflare
  }
}

# Output the discovered services for debugging
output "discovered_api_services" {
  value       = local.expected_api_services
  description = "List of API services discovered from infra subfolders"
}
