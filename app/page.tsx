import { getLatestChat } from '@/lib/chat/queries';
import Chat from './Chat';

export const instant = false;

export default async function Home() {
    const chat = await getLatestChat();
    return (
        <div>
          <Chat chat={chat}/>
        </div>
    );
}