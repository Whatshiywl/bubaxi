module "firebase" {
  source     = "../modules/firebase"
  project_id = var.project_id
  app_name   = var.app_name
  build_dir  = var.build_dir
}
