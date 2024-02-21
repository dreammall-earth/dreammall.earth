# Authentik

We use [Authentik](https://goauthentik.io/) as authentication server.

Read the [documentation]()(https://goauthentik.io/docs/installation/docker-compose) on how to install Authentik with docker compose.

## After installation

 * set a password for `akadmin` user. Add this Password to the `.env` in the `backend` for the variable `LDAP_ADMIN_PASSWORD`
 * create an LDAP provider
 * create a DreamMall application and assign the LDAP provider to it
 * create an LDAP outpost without integration (choose ------) and assign the DreamMall application to it
 * check the available outposts and click on `View deployment info` for the LDAP outpost. Copy the authentik token
 * paste the token in the `docker-compose.yml` for `AUTHENTIK_TOKEN` 
