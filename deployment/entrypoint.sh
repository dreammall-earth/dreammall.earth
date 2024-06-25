#!/bin/sh

openrc reboot
service nginx start
service mariadb setup
service mariadb start

echo "
CREATE USER 'dreammall'@'localhost' IDENTIFIED BY 'SECRET';
GRANT ALL PRIVILEGES ON * . * TO 'dreammall'@'localhost';
FLUSH PRIVILEGES;
exit
" | mysql

cd /var/www/localhost/htdocs/dreammall.earth/

./deployment/deploy.sh && exec "$@"
