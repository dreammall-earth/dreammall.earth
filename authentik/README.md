# Authentik

We use [Authentik](https://goauthentik.io/) as authentication server.

Read the [documentation]()(https://goauthentik.io/docs/installation/docker-compose) on how to install Authentik with docker compose.

## After installation

 * set a password for `akadmin` user. Add this Password to the `.env` in the `backend`
 * create an LDAP provider
 * create a DreamMall application and assign the LDAP provider to it
 * create an LDAP outpost without integration (choose ------) and assign the DreamMall application to it
 
