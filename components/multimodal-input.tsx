'use client';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, StopCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MultimodalInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export function MultimodalInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  stop,
}: MultimodalInputProps) {
  return (
    <div className="relative flex w-full flex-col">
      <Textarea
        placeholder="Send a message..."
        className="min-h-[60px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) handleSubmit(new Event('submit') as any);
          }
        }}
      />
      <div className="absolute bottom-2 right-2">
        <Button 
          size="icon"
          type={isLoading ? 'button' : 'submit'}
          onClick={() => {
            if (isLoading) stop();
          }}
        >
          {isLoading ? <StopCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
