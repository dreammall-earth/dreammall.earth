# Authentik

To start the authentik server and its services run:

```bash
docker compose up
```

## User Credentials

Wait for some minutes and open [http://localhost:9000](http://localhost:9000).

For login you can use the superadmin credentials:

| description | value                    |
| ----------- | ------------------------ |
| username    | akadmin                  |
| email       | <admin@dreammall.earth>  |
| password    | dreammall                |

## E-Mail testing

Authentik e-mails can be checked locally via [Mailpit](https://mailpit.axllent.org/).

The given setup can be tested via [Authentik's e-mail testing tool](https://github.com/goauthentik/authentik/blob/main/authentik/stages/email/management/commands/test_email.py)

Send a test email with:
```bash
docker compose exec worker ak test_email test@example.com
```

Visit [Mailpit](http://localhost:8025) and see your test email.
