'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import type { UIMessage } from 'ai';

const MAX_INPUT_LENGTH = 150;

export default function Chat
  ({ chat,
  }: {
    chat: {
      id: string;
      messages: UIMessage[];
    } | null;
  }) {
  const [input, setInput] = useState('');
  const [apiError, setApiError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const { messages, sendMessage, status, stop, error } = useChat({
    id: chat?.id,
    messages: chat?.messages ?? [],
    onError: () => {
      setApiError(true);
    },
  });

  return (
    <div className="flex min-h-dvh items-center justify-center gap-6 px-4 py-6 sm:px-6 lg:gap-10">
      <img
        src="/quiz-master.png"
        alt="Quiz Master"
        className="hidden h-32 w-32 shrink-0 drop-shadow-xl md:block lg:h-40 lg:w-40 xl:h-44 xl:w-44"
      />
      <div className="flex h-[min(40rem,calc(100dvh-3rem))] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#e7dcc6] bg-[#f7f1e6] shadow-2xl">
        <header className="border-b border-[#eadfce] px-5 py-4 sm:px-6">
          <p className="text-xs font-medium tracking-wide text-[#b8860b]">
            AI-quizmaster
          </p>
          <h1 className="text-lg font-semibold text-[#0d081c]">Quiz</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 ? (
            <p className="m-auto max-w-sm text-center text-sm leading-relaxed text-[#8d8376]">
              Stel een vraag om het gesprek te starten.
            </p>
          ) : null}
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${message.role === 'user'
                  ? 'rounded-br-md bg-[#0d081c] text-[#f3ead8]'
                  : 'rounded-bl-md bg-white text-[#1c1730]'
                  }`}
              >
                <p
                  className={`mb-1 text-xs font-medium ${message.role === 'user' ? 'text-[#f9c609]' : 'text-[#b8860b]'
                    }`}
                >
                  {message.role === 'user' ? 'Jij' : 'AI'}
                </p>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {inputError && (
          <div role="alert" className="px-5 py-3 text-sm text-red-600">
            Vul eerst een bericht in.
          </div>
        )}

        {apiError ? (
          <div role="alert" className="px-5 py-3 text-sm text-red-600">
            Er kon geen verbinding worden gemaakt met OpenAI.
          </div>
        ) : error ? (
          <div role="alert" className="px-5 py-3 text-sm text-red-600">
            Er is iets fout gegaan. Probeer het later opnieuw.
          </div>
        ) : null}

        {input.length >= MAX_INPUT_LENGTH && (
          <div className="text-red-500">
            Je hebt de maximale lengte bereikt.
          </div>
        )}

        <form
          className="flex items-center gap-2 border-t border-[#eadfce] bg-[#f3ecdf] p-3 sm:p-4"
          onSubmit={e => {
            e.preventDefault();

            if (input.length === 0) {
              setInputError(true);
              return;
            }

            setInputError(false);
            setApiError(false);
            sendMessage({ text: input });
            setInput('');
          }}
        >
          <textarea
            className="min-w-0 flex-1 rounded-xl border border-[#e4d7c2] bg-white px-4 py-3 text-sm text-[#0d081c] outline-none placeholder:text-[#a39888] focus:border-[#e2b323] focus:ring-2 focus:ring-[#e2b323]/30"
            value={input}
            placeholder="Typ een bericht…"
            maxLength={MAX_INPUT_LENGTH}
            onChange={e => setInput(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#0d081c] px-4 py-3 text-sm font-medium text-[#f3ead8] transition-colors hover:bg-[#241b3d]"
          >
            Verstuur
          </button>
          {(status === 'submitted' || status === 'streaming') && (
            <button
              type="button"
              className="shrink-0 rounded-xl bg-[#0d081c] px-4 py-3 text-sm font-medium text-[#f3ead8] transition-colors hover:bg-[#241b3d]"
              onClick={stop}
            >
              Stop
            </button>
          )}
        </form>
      </div>
    </div>
  );
}