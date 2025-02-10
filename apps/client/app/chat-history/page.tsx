'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { MessageSquare, Calendar, Clock, ChevronRight, X } from 'lucide-react';

interface Message {
    content: string;
    sender: 'user' | 'llm';
    timestamp: Date;
}

interface Chat {
    id: string;
    text: string;
    timestamp: Date;
    messages: Message[];
}

export default function ChatHistory() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const { address, connected } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (address && connected) {
            console.log('Wallet connected, loading chats for address:', address);
            loadChats();
        }
    }, [address, connected]);

    const loadChats = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Log the full URL being called
            const url = `/v1/query/all-chats/${address}`;
            console.log('Calling API endpoint:', url);
            
            const response = await api.get(url);
            console.log('API Response:', response);
            
            if (Array.isArray(response.data)) {
                const formattedChats = response.data.map(chat => ({
                    id: chat.id,
                    text: chat.text || 'Untitled Chat',
                    timestamp: new Date(chat.timestamp),
                    messages: chat.messages
                }));
                console.log('Formatted chats:', formattedChats);
                setChats(formattedChats);
            } else {
                console.error('Unexpected API response format:', response.data);
                setError('Invalid data format received from server');
            }
        } catch (error: any) {
            console.error('Error loading chats:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            setError(`Failed to load chat history: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Debug logging
    useEffect(() => {
        console.log('Current chats state:', chats);
    }, [chats]);

    const handleChatClick = (chat: Chat) => {
        setSelectedChat(chat);
    };

    const handleStartChat = (chatId: string) => {
        router.push(`/?chat=${chatId}`);
    };

    const handleClosePreview = () => {
        setSelectedChat(null);
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const chatDate = new Date(date);
        
        if (chatDate.toDateString() === today.toDateString()) {
            return `Today at ${chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (chatDate.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${chatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return chatDate.toLocaleDateString([], { 
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <MessageSquare className="h-12 w-12 text-orange-500 mb-4" />
                <p className="text-gray-600 text-lg">Please connect your wallet to view chat history</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
                <p className="text-gray-600 mt-4">Loading chat history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600">{error}</p>
                <button 
                    onClick={loadChats}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Chat History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chat List */}
                <div className="space-y-4">
                    {chats && chats.length > 0 ? (
                        chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => handleChatClick(chat)}
                                className={`w-full p-6 bg-white rounded-xl border transition-all duration-200 hover:shadow-lg group
                                    ${selectedChat?.id === chat.id 
                                        ? 'border-orange-500 shadow-lg' 
                                        : 'border-orange-100 hover:border-orange-200'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                        <MessageSquare className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-gray-800 truncate max-w-md">
                                                {chat.text}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {formatDate(chat.timestamp)}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {chat.messages?.length || 0} messages
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-orange-100">
                            <MessageSquare className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No chat history found</p>
                            <p className="text-gray-400 text-sm mt-2">Start a new conversation to see it here</p>
                        </div>
                    )}
                </div>

                {/* Chat Preview */}
                <div className="relative">
                    {selectedChat ? (
                        <div className="bg-white rounded-xl border border-orange-100 p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-gray-800">Chat Preview</h3>
                                <button 
                                    onClick={handleClosePreview}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {selectedChat.messages.map((message, index) => (
                                    <div 
                                        key={index}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-3 rounded-lg ${
                                            message.sender === 'user' 
                                                ? 'bg-orange-500 text-white' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleStartChat(selectedChat.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Continue Chat
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-center text-gray-500">
                            Select a chat to preview messages
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 