# Deployment

## On Alpine 3.18

Update system:
```bash
apk update
apk upgrade
```

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

Install webhook:
```bash
apk add webhook
```

Install git:
```bash
apk add git
```

Install pm2:
```bash
npm install pm2 -g
```

Clone Dreammall:
```bash
cd /var/www/localhost/htdocs/
git clone https://github.com/dreammall-earth/dreammall.earth.git
```

Adjust nginx config:
```bash
# replace nginx config
mv -f deployment/nginx/default.conf /etc/nginx/http.d/default.conf
# adjust the nginx config accordingly
vi /etc/nginx/http.d/default.conf
```

You can use the webhook template `webhook.conf.template` and the `deploy.sh` script in `deployment/webhooks/` for an automatic deployment from a (github) webhook.
```bash
cp deployment/webhooks/hooks.json.template deployment/webhooks/hooks.json
vi deployment/webhooks/hooks.json
# adjust content of .github/webhooks/hooks.json
# replace all variables accordingly

# copy webhook service file
cp deployment/webhooks/webhook.template /etc/init.d/webhook
vi /etc/init.d/webhook
# adjust content of /etc/init.d/webhook
chmod +x /etc/init.d/webhook

# start the webhook service
service webhook start
rc-update add webhook boot
```

For the github webhook configure the following:

| Field                                                | Value                                       |
|------------------------------------------------------|---------------------------------------------|
| Payload URL                                          | https://stage1.dreammall.earth/hooks/github |
| Content type                                         | application/json                            |
| Secret                                               | A SECRET                                    |
| SSL verification                                     | Enable SSL verification                     |
| Which events would you like to trigger this webhook? | Send me everything.                         |
| Active                                               | [x]                                         |