export const loginRequest = {
    scopes: ["api://4f36cf4f-dc44-47a9-907a-b81219672cea/access_as_user"],
    extraQueryParameters: {},
    prompt: "select_account"
};

// Configuración para producción
export const msalConfig = {
    auth: {
        clientId: "b32c0847-391c-4036-8cf2-c86b11aad8e8",
        authority: "https://login.microsoftonline.com/e1ba6395-7a64-4b92-aaf3-a7c020c3d18f",
        redirectUri: window.location.origin // Detecta automáticamente la URL actual
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};