'use client';

import { useState } from 'react';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { DeepResearch } from './deep-research';
import { useDeepResearch } from '@/lib/deep-research-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state: deepResearchState } = useDeepResearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { id: String(Date.now()), role: 'user', content: input }]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          responseText += chunk;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === 'assistant') {
              lastMessage.content = responseText;
              return [...newMessages];
            } else {
              return [...newMessages, { 
                id: String(Date.now()),
                role: 'assistant', 
                content: responseText 
              }];
            }
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4">
        <Messages 
          messages={messages}
          isLoading={isLoading} 
        />
      </div>

      <form onSubmit={handleSubmit} className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MultimodalInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
        />
      </form>

      <DeepResearch
        isActive={true}
        onToggle={() => {}}
        isLoading={isLoading}
        activity={deepResearchState.activity}
        sources={deepResearchState.sources}
      />
    </div>
  );
}
