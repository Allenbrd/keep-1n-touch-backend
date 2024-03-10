import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const supabaseAdmin = () => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! } } }
    )
    return supabase;
}

export default supabaseAdmin