'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

const MAX_INPUT_LENGTH = 2000;

export default function Chat() {
  const [input, setInput] = useState('');
  const [apiError, setApiError] = useState(false);
  const [inputError, setInputError] = useState(false);	
  const { messages, sendMessage, status, stop, error } = useChat({
    onError: () => {
      setApiError(true);
    },
  });

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6">
      <div className="flex h-[min(40rem,calc(100dvh-3rem))] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-xs font-medium tracking-wide text-teal-700">
            AI-quizmaster
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Quiz</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 ? (
            <p className="m-auto max-w-sm text-center text-sm leading-relaxed text-slate-400">
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
                  ? 'rounded-br-md bg-teal-700 text-white'
                  : 'rounded-bl-md bg-slate-100 text-slate-800'
                  }`}
              >
                <p
                  className={`mb-1 text-xs font-medium ${message.role === 'user' ? 'text-teal-100' : 'text-teal-700'
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
          className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/80 p-3 sm:p-4"
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
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            value={input}
            placeholder="Typ een bericht…"
            maxLength={MAX_INPUT_LENGTH}
            onChange={e => setInput(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
          >
            Verstuur
          </button>
          {(status === 'submitted' || status === 'streaming') && (
            <button
              type="button"
              className="shrink-0 rounded-xl bg-teal-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
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