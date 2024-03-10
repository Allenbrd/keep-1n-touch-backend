import supabaseAdmin from "../_shared/supabaseAdmin.ts";

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

const admin = supabaseAdmin();

// Define the interface for the visit, mood, medication, and symptom data
interface Visit {
  patient_id: string;
  created_at?: Date;
}

interface Mood {
  visit_id: string;
  patient_id: string;
  level: number;
  created_at?: Date;
}

interface Medication {
  visit_id: string;
  patient_id: string;
  taken: boolean;
  created_at?: Date;
}

interface Symptom {
  visit_id: string;
  patient_id: string;
  value: string;
  created_at?: Date;
}

// Function to create a new visit with mood, medications, and symptoms
async function createNewVisit(
  patientId: string,
  moodData: Omit<Mood, 'visit_id'>,
  medicationData: Omit<Medication, 'visit_id'>[],
  symptomData: Omit<Symptom, 'visit_id'>[],
): Promise<void> {
  // Supposing Supabase client has been initialized and imported as `supabase`
  // Start a transaction
  const { data: visitData, error: visitError } = await admin
    .from('visits')
    .insert({ patient_id: patientId });

  if (visitError || !visitData || (visitData as any[]).length === 0) {
    console.error('Error inserting visit:', visitError);
    return;
  }

  const visitId = (visitData as any[])[0]?.id; // Assuming the visit ID is returned upon insertion

  // Insert mood data
  const { error: moodError } = await admin
    .from('mood')
    .insert({ ...moodData, visit_id: visitId, patient_id: patientId });

  if (moodError) {
    console.error('Error inserting mood:', moodError);
    // Optionally handle transaction rollback
    return;
  }

  // Insert medication data
  for (const medication of medicationData) {
    const { error: medicationError } = await admin
      .from('medication')
      .insert({ ...medication, visit_id: visitId, patient_id: patientId });

    if (medicationError) {
      console.error('Error inserting medication:', medicationError);
      // Optionally handle transaction rollback
      return;
    }
  }

  // Insert symptom data
  for (const symptom of symptomData) {
    const { error: symptomError } = await admin
      .from('symptoms')
      .insert({ ...symptom, visit_id: visitId, patient_id: patientId });
  
    if (symptomError) {
      console.error('Error inserting symptom:', symptomError);
      // Optionally handle transaction rollback
      return;
    }
  }

  // If all insertions are successful
  console.log('New visit and associated data were inserted successfully');
}

console.log("Hello from Functions!")
Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }
  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})


console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/newVisit' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
