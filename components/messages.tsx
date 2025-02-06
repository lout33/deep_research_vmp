'use client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function Messages({ messages, isLoading }: MessagesProps) {
  return (
    <div className="px-4">
      {messages.map((message) => (
        <div key={message.id} className={`mb-4 ${message.role === 'assistant' ? 'ml-8' : 'mr-8'}`}>
          <div className={`p-4 rounded-lg ${
            message.role === 'assistant' 
              ? 'bg-muted' 
              : 'bg-primary text-primary-foreground'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="mb-4 ml-8">
          <div className="p-4 rounded-lg bg-muted">
            Thinking...
          </div>
        </div>
      )}
    </div>
  );
}
