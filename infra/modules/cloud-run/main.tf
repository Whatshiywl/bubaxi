terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

variable "project_id"     { type = string }
variable "region"         { type = string }
variable "app_name"       { type = string }
variable "build_dir"      { type = string }
variable "service_name"   {
  type = string
  default = ""
}
variable "dockerfile" {
  type = string
  default = ""
}
variable "map_domain" {
  type = bool
  default = false
}
variable "domain_prefix" {
  type = string
  default = ""
}

locals {
  abs_build_dir = "${path.module}/../../../${var.build_dir}"
  assets_hash = sha1(join("", [
    for f in fileset(local.abs_build_dir, "**") :
      filesha1("${local.abs_build_dir}/${f}")
  ]))
  dockerfile_path = var.dockerfile != "" ? "${path.root}/${var.dockerfile}" : "${path.module}/Dockerfile"
  dockerfile_hash = filesha256(local.dockerfile_path)
  repository_id = "${var.app_name}-repo"
  image_uri = "${var.region}-docker.pkg.dev/${var.project_id}/${local.repository_id}/${var.app_name}:${local.image_tag}"
  image_tag = "latest"
  service_name = var.service_name != "" ? var.service_name : var.app_name
  domain_name = var.domain_prefix != "" ? "${var.domain_prefix}.bubaxi.com" : "bubaxi.com"
}

resource "google_storage_bucket" "build_logs" {
  name     = "${var.project_id}-build-logs"
  location = var.region
  uniform_bucket_level_access = true
}

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = local.repository_id
  format        = "DOCKER"
  description   = "Docker images for ${var.app_name}"
}

module "iam" {
  source          = "../iam"
  project_id      = var.project_id
  region          = var.region
  repository_name = google_artifact_registry_repository.repo.name
}

resource "null_resource" "build_and_push" {
  depends_on = [
    google_storage_bucket.build_logs,
    google_artifact_registry_repository.repo,
    module.iam
  ]

  # Re-run if the Dockerfile or compiled output changes.
  triggers = {
    assets_hash     = local.assets_hash
    dockerfile_hash = local.dockerfile_hash
  }

  provisioner "local-exec" {
    command = <<-EOT
      cp ${path.module}/Dockerfile ${local.abs_build_dir}/Dockerfile
      gcloud builds submit \
        --tag ${local.image_uri} \
        --project ${var.project_id} \
        --gcs-log-dir=gs://${google_storage_bucket.build_logs.name} \
        ${local.abs_build_dir}
    EOT
  }
}

resource "google_cloud_run_service" "service" {
  name     = local.service_name
  location = var.region

  template {
    spec {
      containers {
        image = local.image_uri

        # Change if your container listens on a different port
        ports {
          name           = "http1"
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Make sure the image exists before we deploy
  depends_on = [
    null_resource.build_and_push,
    module.iam
  ]
}

resource "google_cloud_run_service_iam_member" "public_invoker" {
  service  = google_cloud_run_service.service.name
  location = google_cloud_run_service.service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_domain_mapping" "default" {
  count    = var.map_domain ? 1 : 0
  location = var.region
  name     = local.domain_name

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_service.service.name
  }
}

data "cloudflare_zones" "bubaxi" {
  filter {
    name = "bubaxi.com"
  }
}

resource "cloudflare_record" "subdomain" {
  count = var.map_domain && var.domain_prefix != "" ? 1 : 0
  zone_id = data.cloudflare_zones.bubaxi.zones[0].id
  name    = var.domain_prefix
  type    = "CNAME"
  content = "ghs.googlehosted.com"
  ttl     = 300
  proxied = false  # Cloud Run won't work if proxied through Cloudflare
}

output "service_name" {
  value = google_cloud_run_service.service.name
}

output "iam_ready" {
  value = true
}
