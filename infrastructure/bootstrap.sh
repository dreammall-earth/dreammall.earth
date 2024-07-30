#!/usr/bin/env bash

set -euxo pipefail

apk update
apk upgrade
apk add nginx openrc nodejs npm git mysql mysql-client

npm install -g pnpm pm2
pm2 startup

rc-update add pm2 boot
rc-update add nginx boot
service nginx start

service mariadb setup
rc-update add mariadb boot
sed -e '/skip-networking/ s/^#*/#/' -i /etc/my.cnf.d/mariadb-server.cnf
service mariadb start


PROJECT_ROOT=/var/www/localhost/htdocs/dreammall.earth

mkdir -p /etc/nginx/http.d
cp -f $PROJECT_ROOT/deployment/nginx/default.conf /etc/nginx/http.d/default.conf
cp $PROJECT_ROOT/deployment/nginx/frontend.conf /etc/nginx/http.d/frontend.conf
cp $PROJECT_ROOT/deployment/nginx/admin.conf /etc/nginx/http.d/admin.conf

mysql -e "CREATE USER 'dreammall'@'localhost' IDENTIFIED BY 'SECRET'; GRANT ALL PRIVILEGES ON * . * TO 'dreammall'@'localhost'; FLUSH PRIVILEGES;"

cp $PROJECT_ROOT/backend/.env.dist $PROJECT_ROOT/backend/.env
cp $PROJECT_ROOT/presenter/.env.dist $PROJECT_ROOT/presenter/.env
cp $PROJECT_ROOT/frontend/.env.dist $PROJECT_ROOT/frontend/.env
cp $PROJECT_ROOT/admin/.env.dist $PROJECT_ROOT/admin/.env

# The target ports here must match the port mappings of the Vagrant file
sed -e 's/localhost:3001/localhost:8000/g' -i $PROJECT_ROOT/*/.env
sed -e 's/localhost:4000/localhost:8000\/api/g' -i $PROJECT_ROOT/*/.env
sed -e 's/localhost:3000/localhost:8080/g' -i $PROJECT_ROOT/*/.env
sed -e 's/localhost:3002/localhost:8082/g' -i $PROJECT_ROOT/*/.env

$PROJECT_ROOT/deployment/deploy.sh
