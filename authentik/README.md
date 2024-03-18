# Authentik

This is an Authentik setup for development in order to make local testing for production behaviour as easy as possible including the authentication mechanisms.

## Preperation

This package comes with an preconfigured authentic - which has its data mainly residing in a postgress database. The contents of this database is available in packed form.

To extract the database use:
```bash
./database.unpack.sh
```
(Note: make sure the database is not running before executing this command)

Alternatively you can not extract the database, which will start the service with an empty database. Use the [Docker Guide](https://goauthentik.io/docs/installation/docker-compose#preparation) from Authentik to get you going then.

## Start Docker

To start the authentik server and its services run:
```bash
docker compose up
```
(Note: make sure to run this command in the authentik folder, since there is another docker-compose setup in the main folder)

## User Credentials

You can navigate to the now running authentik by opening [http://localhost:9000](http://localhost:9000).

To login you can use the superadmins credentials:

| description | value                                          |
|-------------|------------------------------------------------|
| username    | akadmin                                        |
| email       | [admin@dreammall.earth](admin@dreammall.earth) |
| password    | dreammall                                      |

## Publish changes

If you want to publish changes to the database you can use the following command to pack the database:
```bash
./database.pack.sh
```
(Note: this assumes you are not root and sets the permissions of the database files via sudo)
(Note: make sure to shut down the database first before you run the script)
