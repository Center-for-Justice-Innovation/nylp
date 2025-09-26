// src/environments/auth.ts
export const auth = {
    // Your SPA (client) app registration
    clientId: '<YOUR_B2C_CLIENT_ID>',
    // Your B2C tenant domain (NO https)
    tenantDomain: '<your-tenant>.b2clogin.com',
    b2cTenant: '<your-tenant>.onmicrosoft.com',
  
    // Built-in user flows (policies)
    policies: {
      signUpSignIn: 'B2C_1_signupsignin',     // required
      passwordReset: 'B2C_1_passwordreset',   // optional
      profileEdit: 'B2C_1_profileedit'        // optional
    },
  
    // Redirects — add prod equivalents too
    redirectUri: 'http://localhost:4200/auth',
    postLogoutRedirectUri: 'http://localhost:4200/',
  };
  