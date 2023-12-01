# Deployment

This document describes how to prepare a host to deploy from a specific branch and optionally to update when a push happens to that branch.

All instructions are for an `Alpine 3.18` and require adjustment if a different system is used.

## Update the system
```bash
apk update
apk upgrade
```

## Install Software
Install nginx:
```bash
apk add nginx
rc-update add nginx boot
service nginx start
```

Install node & npm:
```bash
apk add nodejs npm
```

Install pm2:
```bash
npm install pm2 -g
pm2 startup
rc-update add pm2 boot
```

Install git:
```bash
apk add git
```

## Install the project

Clone the repository:
```bash
cd /var/www/localhost/htdocs/
git clone https://github.com/dreammall-earth/dreammall.earth.git
```

Configure nginx:
```bash
# replace nginx config
mv -f deployment/nginx/default.conf /etc/nginx/http.d/default.conf
# adjust the nginx config accordingly
vi /etc/nginx/http.d/default.conf
```

## Deploy the project

To deploy the project run
```bash
deployment/deploy.sh
```

This will build all projects parts and start a pm2 instance to serve the corresponding services currently defined in the nginx config found in `deployment/nginx/default.conf`.

Those services are:

| Service             | URL                                        |
|---------------------|--------------------------------------------|
| presenter           | [https://host/](https://host/)             |
| docs                | [https://host/docs](https://host/docs)     |
| webhooks (optional) | [https://host/hooks/](https://host/hooks/) |

## (Optional) Webhook to auto update

To enable autoupdate from a github branch do the following:

Install webhook:
```bash
apk add webhook
```

Configure webhook:
```bash
cp deployment/webhooks/hooks.json.template deployment/webhooks/hooks.json
vi deployment/webhooks/hooks.json
# adjust content of .github/webhooks/hooks.json
# replace all variables accordingly

# copy webhook service file
cp deployment/init.d/webhook.template /etc/init.d/webhook
vi /etc/init.d/webhook
# adjust content of /etc/init.d/webhook
chmod +x /etc/init.d/webhook

# start the webhook service
service webhook start
rc-update add webhook boot
```

In github configure a webhook pointing to the correct url with the following setting:

| Field                                                | Value                                                  |
|------------------------------------------------------|--------------------------------------------------------|
| Payload URL                                          | [https://host/hooks/github](https://host/hooks/github) |
| Content type                                         | application/json                                       |
| Secret                                               | A SECRET                                               |
| SSL verification                                     | Enable SSL verification                                |
| Which events would you like to trigger this webhook? | Send me everything.                                    |
| Active                                               | [x]                                                    |

Remark: Be aware that you need to restart webhook if you change the configuration in hooks.json e.g. when changing the branch to listen to.
