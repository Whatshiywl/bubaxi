variable "project_id"       { type = string }
variable "region"           { type = string }
variable "repository_name"  { type = string }

locals {
  cloud_build_sa = "${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}

data "google_project" "current" {
  project_id = var.project_id
}
