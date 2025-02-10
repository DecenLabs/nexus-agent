'use client';
import React from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';

interface ChatHistoryProps {
    onSelectChat: (text: string, chatId: string) => void;
    chats: { text: string; timestamp: Date; id: string }[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chats, onSelectChat }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { connected } = useWallet();

    if (!connected || chats.length === 0) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full"
            >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium flex-1 text-left">Chat History</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-64 overflow-y-auto z-50">
                    {chats.map((chat, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onSelectChat(chat.text, chat.id);
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                        >
                            <span className="text-sm text-gray-600 truncate">{chat.text}</span>
                            <span className="text-xs text-gray-400">
                                {new Date(chat.timestamp).toLocaleDateString()}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatHistory; 