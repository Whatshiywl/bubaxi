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

resource "google_storage_bucket" "site" {
  name                        = "${var.project_id}-${var.app_name}-site"
  location                    = var.region
  uniform_bucket_level_access = true
  versioning { enabled = true }

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
