async function getFHIRAccessToken(): Promise<string | null> {
    const tenantId = Deno.env.get("AZURE_AD_TENANT_ID")!;
    const clientId = Deno.env.get("AZURE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("AZURE_CLIENT_SECRET")!;
    const resource = Deno.env.get("AZURE_FHIR_SERVICE_URL")!;
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId as string);
    params.append("client_secret", clientSecret as string);
    params.append("resource", resource);
  
    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
  
      if (!response.ok) {
        throw new Error(`Error obtaining access token: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  export default getFHIRAccessToken
  