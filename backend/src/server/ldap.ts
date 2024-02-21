import { Client } from 'ldapts'

import { CONFIG } from '#config/config'

let ldapClient: Client

export const getLdapClient = async (): Promise<Client> => {
  if (ldapClient) return ldapClient
  ldapClient = new Client({
    // url: 'ldaps://localhost:636',
    url: CONFIG.LDAP_URL,
    /*
    timeout: 0,
    connectTimeout: 0,
    tlsOptions: {
      minVersion: 'TLSv1.2',
    },
    strictDN: true,
    */
  })

  /*
  await ldapClient.startTLS({
    ca: '',
  })
  */

  await ldapClient.bind(CONFIG.LDAP_ADMIN_DN, CONFIG.LDAP_ADMIN_PASSWORD)

  return ldapClient
}
