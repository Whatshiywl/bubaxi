resource "google_artifact_registry_repository_iam_member" "cloud_build_writer" {
  project    = var.project_id
  location   = var.region
  repository = var.repository_name

  role   = "roles/artifactregistry.writer"
  member = "serviceAccount:${local.cloud_build_sa}"
}

output "ready" {
  value = true
}
