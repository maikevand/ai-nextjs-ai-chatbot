import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';

import { openai } from '@ai-sdk/openai';

const MAX_INPUT_LENGTH = 2000;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const lastMessage = messages[messages.length - 1];

  if (
    lastMessage.parts[0].type === 'text' &&
    lastMessage.parts[0].text.length > MAX_INPUT_LENGTH
  ) {
    return new Response('Het bericht is te lang.', { status: 400 });
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
    maxOutputTokens: 500,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
