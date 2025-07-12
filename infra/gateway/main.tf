module "cloud_run" {
  source          = "../modules/cloud-run"
  project_id      = var.project_id
  app_name        = var.app_name
  region          = var.region
  build_dir       = var.build_dir
  map_domain      = true
  domain_prefix   = "api"
  providers = {
    cloudflare = cloudflare
  }
}
