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

variable "env_vars" {
  type        = map(string)
  description = "Environment variables for the container"
  default     = {}
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
  image_tag = sha1("${local.assets_hash}${local.dockerfile_hash}")
  image_uri = "${var.region}-docker.pkg.dev/${var.project_id}/${local.repository_id}/${var.app_name}:${local.image_tag}"
  service_name = var.service_name != "" ? var.service_name : var.app_name
  domain_name = var.domain_prefix != "" ? "${var.domain_prefix}.bubaxi.com" : "bubaxi.com"
}
