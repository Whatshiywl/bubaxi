resource "local_file" "firebaserc" {
  content  = local.firebaserc_content
  filename = local.firebaserc_output_path
}

resource "local_file" "firebase_json" {
  content  = local.firebase_json_content
  filename = local.firebase_json_output_path
}

resource "null_resource" "firebase_deploy" {
  provisioner "local-exec" {
    command = <<EOT
      firebase deploy --only hosting:${var.app_name} --project ${var.project_id}
    EOT
  }

  triggers = {
    assets_hash = local.assets_hash
  }

  depends_on = [
    local_file.firebaserc,
    local_file.firebase_json
  ]
}
