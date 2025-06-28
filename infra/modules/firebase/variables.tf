variable "project_id"     { type = string }
variable "app_name"       { type = string }
variable "site_name"      { type = string }
variable "build_dir"      { type = string }

locals {
  abs_build_dir = "${path.module}/../../../${var.build_dir}"
  assets_hash = sha1(join("", [
    for f in fileset(local.abs_build_dir, "**") :
      filesha1("${local.abs_build_dir}/${f}")
  ]))
}
