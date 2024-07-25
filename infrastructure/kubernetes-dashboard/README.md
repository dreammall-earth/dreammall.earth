# Kubernetes Dashboard

Follow the official [documentation](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/).

Kubernetes dashboard will be running at <https://localhost:8443>.

To create a service account [like this](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md) run the following:
```
$ kubectl apply -f ./service-account.yaml
```

Get the token with:
```
$ kubectl -n kubernetes-dashboard create token admin-user
```

Log in to your kubernetes dashboard with the token.
