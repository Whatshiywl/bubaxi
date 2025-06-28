resource "local_file" "firebaserc" {
  content  = templatefile("${path.module}/.firebaserc.tftpl", {
    project_id = var.project_id
    app_name   = var.app_name
    site_name  = var.site_name
  })
  filename = "${path.module}/../../../.firebaserc"
}

resource "local_file" "firebase_json" {
  content  = templatefile("${path.module}/firebase.json.tftpl", {
    app_name   = var.app_name
    build_dir  = var.build_dir
  })
  filename = "${path.module}/../../../firebase.json"
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
