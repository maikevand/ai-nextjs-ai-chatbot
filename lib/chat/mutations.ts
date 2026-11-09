import { supabase } from '../supabase/server';
import type { UIMessage } from 'ai';

export async function saveChat(id: string, messages: UIMessage[]) {
    const { error } = await supabase.from('chats').upsert({
        id: id,
        messages: messages,
        updated_at: new Date().toISOString(),
    })
    if (error) {
        throw new Error(error.message);
    }
}
