# Helmfile

You need the following tools installed on your machine:
- [sops](https://github.com/getsops/sops)

- [age](https://github.com/FiloSottile/age)

- [kubectl](https://kubernetes.io/docs/tasks/tools/)

- [helmfile](https://helmfile.readthedocs.io/en/latest/) 
  - [helm secrets](https://github.com/jkroepke/helm-secrets/wiki/Installation)
  - [helm diff](https://github.com/databus23/helm-diff)

Not required, but highly recommended:
- [k9s](https://k9scli.io/)

## Setup

Append your public `age` public key to [sops.yaml](../../.sops.yaml).
Ask another developer who can already read sops [secret files](./secrets) to re-encrypt these files with your public key.

Place the kube config file so that your `kubectl` can read it:
```sh
mkdir -p ~/.kube
# make sure you use sops --version >= 3.9.0
sops decrypt ./secrets/kubeconfig > ~/.kube/config
```

## Deployment

Relevant files that you might need to change:
- [helmfile](./helmfile.yaml.gotmpl)
- [environments](./environments/)
- [secret files](./secrets)
- [value files](./values/)

Check the default environment:
```sh
helmfile diff
```

Check the `master` environment:
```sh
helmfile --environment master diff
```

If you are happy with what you see, you can do:

```sh
helmfile apply
# or
helmfile --environment master apply
```

Tip: To speed things up you can add the `--skip-deps` command line argument:
```sh
helmfile --skip-deps diff
helmfile --skip-deps apply
```

Observe the pods starting up:
```sh
kubectl get pods -w
```

Or you can use:
```sh
k9s
```

After a while your release will be up and running.
