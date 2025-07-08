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
  firebaserc_template_path = "${path.module}/.firebaserc.tftpl"
  firebaserc_content = templatefile(local.firebaserc_template_path, {
    project_id = var.project_id
    app_name   = var.app_name
    site_name  = var.site_name
  })
  firebaserc_output_path = "${path.module}/../../../.firebaserc"
  firebase_json_template_path = "${path.module}/firebase.json.tftpl"
  firebase_json_content = templatefile(local.firebase_json_template_path, {
    app_name  = var.app_name
    build_dir = var.build_dir
  })
  firebase_json_output_path = "${path.module}/../../../firebase.json"
}
