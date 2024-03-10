// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.39.7/dist/module/index.js";
import supabaseClient from "../_shared/supabaseClient.ts";
import getFHIRAccessToken from "../_shared/getFHIRAccessToken.ts";
import { createAllergyIntolerance, createMedicationAdministration } from "./insertResources.ts";
import { AllergyIntolerance, MedicationAdministration } from "../_shared/FHIRResources.ts";

type PatientData = {
  name: string;
  familyName: string,
  gender: string,
  birthDate: Date,
  medications: MedicationAdministration[],
  allergies: AllergyIntolerance[],
}

const fhirServiceUrl = Deno.env.get("AZURE_FHIR_SERVICE_URL")!;

async function createFHIRPatient(fhirAccessToken: string, patientData: PatientData): Promise<string> {

  const response = await fetch(`${fhirAccessToken}/Patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/fhir+json",
      "Authorization": `Bearer ${fhirAccessToken}`,
    },
    body: JSON.stringify(
      {
        "resourceType": "Patient",
        "name": [{
          "use": "official",
          "family": patientData.familyName,
          "given": [patientData.name]
        }],
        "gender": patientData.gender,
        "birthDate": "1945-04-12"
      }
    ),
  });

  if (!response.ok) {
    throw new Error(`Failed to create FHIR patient: ${response.statusText}`);
  }

  const fhirPatient = await response.json();
  return fhirPatient.id; // Assuming FHIR API returns the patient id in this field
}

async function createNewPatientWithDetails(supabase: SupabaseClient, fhirAccessToken: string, patientDetails: PatientData) {

  // First, create the patient in FHIR
  const fhirPatientId = await createFHIRPatient(fhirAccessToken, patientDetails);

  // Next, insert the patient into the Supabase table
  const { data: supabasePatient, error: supabasePatientError } = await supabase
    .from('patients')
    .insert([{
      id: fhirPatientId,
      name: patientDetails.name+patientDetails.familyName,
      birth_date: patientDetails.birthDate,
    }]);

  if (supabasePatientError) {
    throw new Error(`Failed to insert patient in Supabase: ${supabasePatientError?.message}`);
  }

  // Insert the other patient details like medications, vital signs, conditions, allergies into FHIR API
  // Similar to creating the patient, you would create these resources with the FHIR API

  for (const medication of patientDetails.medications) {
    createMedicationAdministration(fhirAccessToken,  fhirPatientId, medication)
  }

  for (const allergy of patientDetails.allergies) {
    createAllergyIntolerance(fhirAccessToken, fhirPatientId, allergy)
  }

  // After all the resources are created, return a confirmation with the patient's Supabase and FHIR IDs
  return {
    patient_id: fhirPatientId,
  };

}

Deno.serve(async (req) => {

  const fhirAccessToken = await getFHIRAccessToken();
  if (!fhirAccessToken) {
    return new Response("Failed to obtain access token.", { status: 500 });
  }

  const authHeader = req.headers.get('Authorization')!
  const supabase = supabaseClient(authHeader);

  const { new_patient } = await req.json()
  
  createNewPatientWithDetails(supabase, fhirAccessToken, new_patient);

  return new Response('', { status: 200 });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/createPatient' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
