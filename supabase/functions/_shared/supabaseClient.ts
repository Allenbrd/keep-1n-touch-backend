/**
 * Creates a Supabase client with the provided authorization header.
 * @param authHeader - The authorization header to be included in the requests.
 * @returns The Supabase client instance.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const supabaseClient = (authHeader: string) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
    )
    return supabase;
}
    
export default supabaseClient


