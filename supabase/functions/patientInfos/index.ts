// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import getFHIRAccessToken from "../_shared/getFHIRAccessToken.ts";
import getPatientFHIRData from "../_shared/getPatientFHIRData.ts";
import getPatientVisit from "../_shared/getPatientVisit.ts";
import supabaseAdmin from "../_shared/supabaseAdmin.ts";

const admin = supabaseAdmin();

async function getPatientInfo(patientId: string): Promise<any | null> {

  let final_response = {fhir: {}, internal: {}};

  const fhir_data = await getPatientFHIRData(patientId);

  final_response.fhir = fhir_data;

  const visit = await getPatientVisit(patientId, admin, true, undefined);

  final_response.internal = (visit === undefined || visit === null ? {} : visit);

  return final_response;
}


Deno.serve(async (req) => {
  const { patient_id } = await req.json()
  
  const patientInfos = await getPatientInfo(patient_id)

  if(
      // Object.keys(patientInfos.fhir).length === 0 || 
      Object.keys(patientInfos.internal).length === 0
    ){
    return new Response(
      JSON.stringify("internal Error - failed to get patient infos"),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  return new Response(
    JSON.stringify(patientInfos),
    { status: 200, headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/patientInfos' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --   '{"name":"Functions"}'

*/
