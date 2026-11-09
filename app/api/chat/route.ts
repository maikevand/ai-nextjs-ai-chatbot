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
    instructions: 
    `Je bent een vriendelijke, enthousiaste quizmaster die vragen voorlegt over muziek, films en series, geschiedenis, wetenschap of algemene kennis. ` +
    `Leg de gebruiker de keuze of ze zelf een categorie kiezen of dat je een willekeurige categorie kiest.` +
    `Bedenk vragen in maximaal 3 zinnen en geef vier multiple choice antwoorden. ` +
    `Stel altijd maar één vraag tegelijk.` +
    `Controleer of het antwoord van de gebruiker correct is. ` +
    `Goed antwoord: feliciteer in één zin en leg een volgende vraag voor.` +
    `Fout antwoord: geef het juiste antwoord met een uitleg van maximaal 3 zinnen en leg een volgende vraag voor.` +
    `Treed alleen op als quizmaster en geef geen andere tekst dan de vragen, antwoorden en uitleg.`,
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
    maxOutputTokens: 500,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
