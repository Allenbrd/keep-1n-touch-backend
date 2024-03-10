import getFHIRAccessToken from "./getFHIRAccessToken.ts";

async function getClientFHIRData(patientId: string) {

    const accessToken = await getFHIRAccessToken();
    if (!accessToken) {
      console.error("Failed to obtain access token.");
      return {};
    }
  
    const fhirServiceUrl = Deno.env.get("AZURE_FHIR_SERVICE_URL");
    const patientUrl = `${fhirServiceUrl}/Patient/${patientId}`;
    
    // Prepare URLs for the additional resources
    const vitalSignsUrl = `${fhirServiceUrl}/Observation?patient=${patientId}&category=vital-signs`;
    const allergiesUrl = `${fhirServiceUrl}/AllergyIntolerance?patient=${patientId}`;
    const conditionsUrl = `${fhirServiceUrl}/Condition?patient=${patientId}`;
    const medicationStatementUrl = `${fhirServiceUrl}/MedicationStatement?patient=${patientId}`;
  
    try {
      // Fetch all the data concurrently using Promise.all
      const results = await Promise.all([
        fetch(patientUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/fhir+json",
          },
        }),
        fetch(vitalSignsUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/fhir+json",
          },
        }),
        fetch(allergiesUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/fhir+json",
          },
        }),
        fetch(conditionsUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/fhir+json",
          },
        }),
        fetch(medicationStatementUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/fhir+json",
          },
        }),
      ]);
  
      // Check if all requests were successful
      if (results.some(response => !response.ok)) {
        console.error("Some FHIR data requests failed.");
        return {};
      }
  
      // Parse JSON for all responses
      const [patientData, vitalSignsData, allergiesData, conditionsData, medicationStatementData] = await Promise.all(
        results.map(response => response.json())
      );
  
      // Construct and return the aggregated FHIR data
      return {
        patient: patientData,
        // deno-lint-ignore no-explicit-any
        vitalSigns: vitalSignsData.entry.map((e: any) => e.resource),
        // deno-lint-ignore no-explicit-any
        allergies: allergiesData.entry.map((e: any) => e.resource),
        // deno-lint-ignore no-explicit-any
        conditions: conditionsData.entry.map((e: any) => e.resource),
        // deno-lint-ignore no-explicit-any
        medicationStatements: medicationStatementData.entry.map((e: any) => e.resource),
      };
    } catch (error) {
      console.error("Failed to fetch FHIR data:", error);
      return {};
    }
  }

export default getClientFHIRData;