import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.39.7/dist/module/index.js";

async function getPatientVisit(patientId: string, supabase: SupabaseClient, mostRecent: Boolean , visitId: string | undefined) {

    if(mostRecent == true){

        const { data: visitData, error: visitError } = await supabase
        .from('visits')
        .select(`
            *,
            mood (
            level
            ),
            medication (
            taken
            ),
            symptoms (
            value
            )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

        if (visitError) {
            console.error(visitError);
            return null;
          }
        
          return visitData;

    }else if(visitId){

        const { data: visitData, error: visitError } = await supabase
        .from('visits')
        .select(`
            *,
            mood (
            level
            ),
            medication (
            taken
            ),
            symptoms (
            value
            )
        `)
        .eq('visit_id', visitId)

        if (visitError) {
            console.error(visitError);
            return null;
          }
        
          return visitData;

    }

  }

export default getPatientVisit;