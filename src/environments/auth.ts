// src/environments/auth.ts
export const auth = {
  tenantDomain: 'nylp.ciamlogin.com',       // host only (no https)
  tenantName:   'nylp.onmicrosoft.com',     // name form (NOT the GUID)
  clientId:     'd8bd6a29-0f55-4e5a-8beb-dd961b447c14',

  redirectUri: 'http://localhost:4200/auth',
  postLogoutRedirectUri: 'http://localhost:4200/',
  knownAuthority: 'nylp.ciamlogin.com'
};

// CIAM default-flow (policy-less) authority:
export const defaultAuthority =
  `https://${auth.tenantDomain}/${auth.tenantName}`;

