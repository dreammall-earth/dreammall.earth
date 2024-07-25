# Helm

Install [helm](https://helm.sh/) on your machine.

## Setup

Run:
```
$ helm install --generate-name --dry-run --debug ./dreammall/
```

If you are happy with what you see, you can do:
```
$ helm install dreammall-development ./dreammall/
```

To override some values, put them into `./values-local.yaml`, we have this file git-ignored:
```
$ helm install dreammall-development ./dreammall/ -f values-local.yml
```

Observe the pods starting up:
```
kubectl get pods -w
```

After a while your release will be up and running.

### TLS Certificate

Make sure your DNS records are in place. Then check your certificates:
```
$ kubectl describe certificates
```

If your certificate "is up to date and has not expired" you can change `letsencrypt-staging` to `letsencrypt-prod` in:
```
$ kubectl edit ingress dreammall-ingress
```

### Tips

If you don't want to configure DNS records for your domain, you can use a browser plugin that sends a user defined `Host: <domain>` header when you visit `https://<load-balancer-ip-address>`.
