#!/bin/sh

apk update
apk upgrade
apk add nginx openrc nodejs npm git mysql mysql-client


npm install pm2 -g
pm2 startup

rc-update add pm2 boot
rc-update add nginx boot
service nginx start


service mariadb setup
rc-update add mariadb boot
sed -e '/skip-networking/ s/^#*/#/' -i /etc/my.cnf.d/mariadb-server.cnf
service mariadb start


cd /var/www/localhost/htdocs/
git clone https://github.com/dreammall-earth/dreammall.earth.git
cd dreammall.earth

mkdir -p /etc/nginx/http.d
cp -f ./deployment/nginx/default.conf /etc/nginx/http.d/default.conf
cp ./deployment/nginx/frontend.conf /etc/nginx/http.d/frontend.conf
cp ./deployment/nginx/admin.conf /etc/nginx/http.d/admin.conf

service nginx restart

mysql -e "CREATE USER 'dreammall'@'localhost' IDENTIFIED BY 'SECRET'; GRANT ALL PRIVILEGES ON * . * TO 'dreammall'@'localhost'; FLUSH PRIVILEGES;"

cp backend/.env.dist backend/.env
cp presenter/.env.dist presenter/.env
cp frontend/.env.dist frontend/.env
cp admin/.env.dist admin/.env

deployment/deploy.sh
