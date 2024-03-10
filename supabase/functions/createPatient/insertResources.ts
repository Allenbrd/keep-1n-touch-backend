import { AllergyIntolerance, MedicationAdministration } from "../_shared/FHIRResources.ts";
import getFHIRAccessToken from "../_shared/getFHIRAccessToken.ts";

const fhirServiceUrl = Deno.env.get("AZURE_FHIR_SERVICE_URL")!;

// Function to create a new MedicationAdministration record in FHIR API
export async function createMedicationAdministration(fhirAccessToken: string, patientFhirId: string, medicationAdministration: MedicationAdministration) {
  
  const response = await fetch(`${fhirServiceUrl}/MedicationAdministration`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${fhirAccessToken}`,
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json',
    },
    body: JSON.stringify({
      ...medicationAdministration,
      resourceType: 'MedicationAdministration',
      subject: { reference: `Patient/${patientFhirId}` },
      status: 'active',
      intent: 'order',
      // medicationCodeableConcept and other necessary fields should be filled in here as needed
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create MedicationAdministration in FHIR: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Function to create a new AllergyIntolerance record in FHIR API
export async function createAllergyIntolerance(fhirAccessToken: string, patientFhirId: string, allergyIntelorence: AllergyIntolerance): Promise<AllergyIntolerance | null> {
  const response = await fetch(`${fhirServiceUrl}/AllergyIntolerance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${fhirAccessToken}`,
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json',
    },
    body: JSON.stringify({
      ...allergyIntelorence,
      resourceType: 'AllergyIntelorence',
      subject: { reference: `Patient/${patientFhirId}` },
      status: 'active',
      intent: 'order',
    }),
  });

  if (!response.ok) {
    console.error(`Failed to create AllergyIntolerance. Status: ${response.status}`);
    return null;
  }

  return await response.json();
}