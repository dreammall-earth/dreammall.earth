# Local test deployment

Currently, we're deploying to a vServer. The following will set up virtual machines locally in order to test out the deployment before it hits `staging` or `production`.

1. Install [Vagrant](https://www.vagrantup.com/) on your machine

1. `cd deployment/local-testing`

1. `vagrant up` .. and wait

1. Following services are running:
   - <http://localhost:8000/>
   - <http://localhost:8000/api>
   - <http://localhost:8000/docs>
   - <http://localhost:8080/>
   - <http://localhost:8082/>

1. Be amazed

In the future we might want to use [Ansible](https://www.ansible.com/) for provisioning. We could run our playbooks against this virtual machine, too.
