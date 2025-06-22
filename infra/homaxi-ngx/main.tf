terraform {
  required_version = ">= 1.7.0"
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" { type = string }
variable "region"     { type = string }
variable "app_name"   { type = string }
variable "build_dir"  { type = string }

resource "google_storage_bucket" "site" {
  name                        = "${var.project_id}-${var.app_name}-site"
  location                    = var.region
  uniform_bucket_level_access = true
  versioning { enabled = false }

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

locals {
  abs_build_dir = "${path.root}/${var.build_dir}"
  assets_hash = sha1(join("", [
    for f in fileset(local.abs_build_dir, "**") :
      filesha1("${local.abs_build_dir}/${f}")
  ]))
}

resource "null_resource" "upload_assets" {
  triggers = {
    assets_hash = local.assets_hash
  }

  provisioner "local-exec" {
    command = <<-EOT
      gsutil -m rsync -r -d "${local.abs_build_dir}" "gs://${google_storage_bucket.site.name}"
      gsutil -m setmeta -h "Cache-Control:public,max-age=3600" "gs://${google_storage_bucket.site.name}/**"
    EOT
  }

  depends_on = [google_storage_bucket.site]
}
