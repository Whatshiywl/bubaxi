variable "project_id"     { type = string }
variable "region"         { type = string }
variable "app_name"       { type = string }
variable "build_dir"      { type = string }
variable "cloudflare_api_token" { type = string }

locals {
  abs_build_dir = "${path.root}/../../${var.build_dir}"
  assets_hash = sha1(join("", [
    for f in fileset(local.abs_build_dir, "**") :
      filesha1("${local.abs_build_dir}/${f}")
  ]))
  dockerfile_hash = filesha256("${path.module}/Dockerfile")
  repository_id = "${var.app_name}-repo"
  image_uri = "${var.region}-docker.pkg.dev/${var.project_id}/${local.repository_id}/${var.app_name}:${local.image_tag}"
  image_tag = "latest"
}
