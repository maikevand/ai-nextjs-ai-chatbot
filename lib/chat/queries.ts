import { supabase } from '../supabase/server';

export async function getLatestChat() {
    const { data, error } = await supabase
    .from('chats')
    .select("id, messages")
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

    if (error) {
        throw new Error(error.message);
    }
    return data;
}