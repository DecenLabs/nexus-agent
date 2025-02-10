import React from 'react';

interface Message {
  text: string;
  sender: 'user' | 'llm';
  isHTML?: boolean;
}

interface MessagesProps {
  messages: Message[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-xl p-4 max-w-[70%] shadow-lg ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200/30'
                : 'bg-orange-50 text-gray-800 shadow-orange-100/20'
            }`}
          >
            {message.isHTML ? (
              <div className="prose prose-orange" dangerouslySetInnerHTML={{ __html: message.text }} />
            ) : (
              <div>{message.text}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
