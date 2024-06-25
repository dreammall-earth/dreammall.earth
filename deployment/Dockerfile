FROM alpine:3.20.1

RUN apk update
RUN apk upgrade

RUN apk add nginx openrc nodejs npm git mysql mysql-client webhook
RUN npm install -g pm2
RUN pm2 startup

# comment out `skip-networking`
RUN sed -e '/skip-networking/ s/^#*/#/' -i /etc/my.cnf.d/mariadb-server.cnf

RUN rc-update add nginx boot
RUN rc-update add pm2 boot
RUN rc-update add mariadb boot

RUN git clone --depth 1 https://github.com/dreammall-earth/dreammall.earth.git /var/www/localhost/htdocs/dreammall.earth
WORKDIR /var/www/localhost/htdocs/dreammall.earth


RUN cp -f deployment/nginx/default.conf /etc/nginx/http.d/default.conf
RUN cp -f deployment/nginx/admin.conf deployment/nginx/frontend.conf /etc/nginx/http.d/

RUN cp backend/.env.dist backend/.env
RUN cp presenter/.env.dist presenter/.env
RUN cp frontend/.env.dist frontend/.env

COPY entrypoint.sh .
ENTRYPOINT ["./entrypoint.sh"]
EXPOSE 80
