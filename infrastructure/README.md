# Infrastructure

This folder contains our infrastructure as code.

The [benefits](https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac#benefits-of-iac) of this paradigm are:
- Cost reduction
- Increase in speed of deployments
- Reduce errors 
- Improve infrastructure consistency
- Eliminate configuration drift

## Local setup

The following will set up virtual machines locally so you can test out if
a change breaks the deployment.

1. Install [packer](https://www.packer.io/) on your machine
1. `cd infrastructure/`
1. `packer init ./vagrant.pkr.hcl`

### (Re)build Vagrant box

1. Install [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/) on your machine
1. `packer build --force --on-error=ask ./vagrant.pkr.hcl`
1. `cd vagrant && vagrant up`
1. Following services are running:
- <http://localhost:8000/>
- <http://localhost:8000/api>
- <http://localhost:8000/docs>
- <http://localhost:8080>
- <http://localhost:8082>
