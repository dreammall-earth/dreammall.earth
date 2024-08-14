packer {
  required_plugins {
    vagrant = {
      version = "~> 1"
      source  = "github.com/hashicorp/vagrant"
    }
  }
}

source "vagrant" "dreammall" {
  communicator = "ssh"
  source_path  = "generic/alpine319"
  provider     = "virtualbox"
  add_force    = true

  output_dir = "packer-output"
}

build {
  sources = ["sources.vagrant.dreammall"]


  provisioner "shell-local" {
    inline = [
      "rm -rf archive",
      "git clone ../../ archive",
      "cd archive",
      "git remote set-url origin https://github.com/dreammall-earth/dreammall.earth.git", # only necessary because of the `git pull -ff` in `deploy.sh`
      "git checkout master",
      "git pull -ff",
      "touch .gitkeep",
    ]
  }

  provisioner "file" {
    source      = "archive"
    destination = "/tmp"
  }

  provisioner "shell" {
    execute_command = "echo 'packer' | sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
    inline = [
      "mkdir -p /var/www/localhost/htdocs/",
      "mv /tmp/archive /var/www/localhost/htdocs/dreammall.earth",
    ]
  }

  provisioner "shell" {
    execute_command = "echo 'packer' | sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
    script          = "./bootstrap.sh"
  }

  provisioner "shell-local" {
    inline = [
      "rm -rf archive/",
      "mkdir -p archive/",
      "touch archive/.gitkeep",
    ]
  }

  error-cleanup-provisioner "shell-local" {
    inline = [
      "rm -rf archive/",
      "mkdir -p archive/",
      "touch archive/.gitkeep",
    ]
  }
}

