# Authentik

This is an Authentik setup for development in order to make local testing for production behaviour as easy as possible including the authentication mechanisms.

## Preperation

This package comes with an preconfigured authentic - which has its data mainly residing in a postgress database. The contents of this database is available in packed form.

To extract the database use:
```bash
./database.unpack.sh
```
(Note: make sure the database is not running before executing this command)

## User Credentials

To login you can use the superadmins credentials:

| description | value                 |
|-------------|-----------------------|
| username    | akadmin               |
| email       | admin@dreammall.earth |
| password    | dreammall             |

## Publish changes

If you want to publish changes to the database you can use the following command to pack the database:
```bash
./database.pack.sh
```
(Note: this assumes you are not root and sets the permissions of the database files via sudo)
(Note: make sure to shut down the database first before you run the script)