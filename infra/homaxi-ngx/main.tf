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
