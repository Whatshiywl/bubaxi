variable "project_id"       { type = string }
variable "region"           { type = string }
variable "repository_name"  { type = string }

data "google_project" "current" {
  project_id = var.project_id
}

locals {
  cloud_build_sa = "${data.google_project.current.number}@cloudbuild.gserviceaccount.com"
}

resource "google_project_service" "run_api" {
  project = var.project_id
  service = "run.googleapis.com"
}

resource "google_artifact_registry_repository_iam_member" "cloud_build_writer" {
  project    = var.project_id
  location   = var.region
  repository = var.repository_name

  role   = "roles/artifactregistry.writer"
  member = "serviceAccount:${local.cloud_build_sa}"
}

output "iam_ready" {
  value = true
}
