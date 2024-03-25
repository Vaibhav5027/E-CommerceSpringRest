import { KeycloakService } from "keycloak-angular";

// export function initializeKeycloak(
//   keycloak: KeycloakService
// ): () => Promise<Boolean> {
//   return () =>
//     keycloak.init({
//       config: {
//         url: "http://localhost:8080",
//         realm: "angular-web",
//         clientId: "angular-web-client",
//       },
//       initOptions: {
//         checkLoginIframe: true,
//         checkLoginIframeInterval: 25,
//         // onLoad: "login-required",
//         // flow: "standard",
//       },

//       loadUserProfileAtStartUp: true,
//     });
// }
