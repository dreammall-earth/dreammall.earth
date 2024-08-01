# Kube-Hetzner

This will set up a Kubernetes cluster on Hetzner.

Follow the [prerequisites](https://github.com/kube-hetzner/terraform-hcloud-kube-hetzner?tab=readme-ov-file#%EF%B8%8F-prerequisites).

Create a passphrase-less SSH key:
```sh
ssh-keygen -f ~/.ssh/kube-hetzner
```

Setup the kubernetes cluster:
```sh
export TF_VAR_hcloud_token=<HETZNER_API_TOKEN>
tofu apply
```

Optionally, you can add local (git-ignored) overrides in `kube_override.tf`.

If you want, you can overwrite your `~/./kube/config` file:
```sh
tofu output --raw kubeconfig > ~/.kube/config
```
Or stream the output into another file and configure your `kubectl` to read from that file.
Check the kubernetes docs how to organize [kubeconfig files](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

Now your cluster is up and running!
```sh
$ kubectl get nodes
NAME                         STATUS   ROLES                       AGE     VERSION
k3s-agent-small-hav          Ready    <none>                      3m1s    v1.29.6+k3s2
k3s-control-plane-fsn1-qdm   Ready    control-plane,etcd,master   3m35s   v1.29.6+k3s2
```

If you want to save costs you can destroy the cluster with:
```sh
tofu destroy
```
