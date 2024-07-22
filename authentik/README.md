# Authentik

This is an Authentik setup for development in order to make local testing for production behaviour as easy as possible including the authentication mechanisms.

## Start Docker

To start the authentik server and its services run:

```bash
docker compose up
```

### Seed the database

```bash
docker compose exec -T postgresql psql authentik --username authentik < dump.sql
```

Alternatively you can not extract the database, which will start the service with an empty database. Use the [Docker Guide](https://goauthentik.io/docs/installation/docker-compose#preparation) from Authentik to get you going then.

## User Credentials

You can navigate to the now running authentik by opening [http://localhost:9000](http://localhost:9000).

To login you can use the superadmins credentials:

| description | value                                          |
| ----------- | ---------------------------------------------- |
| username    | akadmin                                        |
| email       | [admin@dreammall.earth](admin@dreammall.earth) |
| password    | dreammall                                      |

## Update seeds

Dump the content of the database with this command:

```bash
docker compose exec postgresql pg_dump authentik --username authentik --clean --if-exists > dump.sql
```

## E-Mail testing

Authentik e-mails can be checked locally via [Mailpit](https://mailpit.axllent.org/).

### Prepare and start

In the `authentik/` directory start authentik and mailpit:

```bash
docker-compose up
```

### Example

The given setup can be tested via [Authentik's e-mail testing tool](https://github.com/goauthentik/authentik/blob/main/authentik/stages/email/management/commands/test_email.py)

Send a test email with:
```bash
docker compose exec worker ak test_email test@example.com
```

Visit [Mailpit](http://localhost:8025) and see your test email.
