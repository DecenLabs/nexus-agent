'use client';
import React, { useState, useEffect } from 'react';
import PulseLoader from './components/ui/pulseLoader';
import api from './lib/api';
import { useWallet } from '@suiet/wallet-kit';
import JSONFormatter from './utils/JSONFormatter';
import { Send, Plus } from 'lucide-react';

import Messages from './components/sections/Messages';
import SampleQuestions from './components/sections/SampleQuestions';
import LoadingPage from './components/ui/loadingPage';
import ChatHistory from './components/sections/ChatHistory';

export default function Home() {
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'llm'; isHTML?: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { address, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ text: string; timestamp: Date }[]>([]);

  // Load chat history when wallet connects
  useEffect(() => {
    if (address && connected) {
      // Only load chat history for dropdown
      loadAllChats();
    }
  }, [address, connected]);

  const loadChatHistory = async (chatId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/query/history/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllChats = async () => {
    try {
      const response = await api.get(`/v1/query/all-chats/${address}`);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async (message?: string) => {
    const userMessage = message || inputValue.trim();

    if (userMessage) {
      setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
      setInputValue('');
      setIsThinking(true);

      try {
        // Always send the wallet address with the query
        const response = await api.post('/query', {
          query: userMessage,
          walletAddress: address
        });

        const res = response.data[0];
        let llmResponse = '';

        // console log bearer and token and model used
        console.log('Bearer:', process.env.ATOMASDK_BEARER_AUTH);
        console.log("model used: ", process.env.ATOMA_CHAT_MODEL);
        console.log('walletAddress:', address);
        console.log('userMessage:', userMessage);
        console.log('response:', response);


        if (typeof res.response === 'string') {
          llmResponse = res.response;
        } else {
          llmResponse = JSONFormatter.format(res.response);
        }

        setMessages((prev) => [...prev, { text: llmResponse, sender: 'llm', isHTML: true }]);
      } catch (error) {
        console.error('Error querying the LLM:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: 'Sorry, there was an error. Please try again.',
            sender: 'llm',
            isHTML: false
          }
        ]);
      } finally {
        setIsThinking(false);
      }
    }
  };

  const handleSelectChat = async (text: string, chatId: string) => {
    setInputValue('');
    await loadChatHistory(chatId);
  };

  if (isLoading) return <LoadingPage />;
  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      <div className={`flex-1 flex flex-col ${messages.length > 0 ? '' : 'justify-center'}`}>
        <div className="flex items-center justify-between">
          {connected && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* Chat History Dropdown */}
        <div className="mb-4">
          <ChatHistory chats={chatHistory} onSelectChat={handleSelectChat} />
        </div>

        {/* Messages section - only show if there are messages */}
        {messages.length > 0 ? (
          <div className="flex-1 overflow-y-auto mb-6 rounded-2xl bg-white border border-orange-100 shadow-lg shadow-orange-100/20">
            <div className="relative h-full">
              <div className="relative z-10 p-6">
                <Messages messages={messages} />
                {isThinking && (
                  <div className="relative mb-3 p-4 rounded-xl bg-orange-50 w-fit max-w-[70%]">
                    <PulseLoader />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Show centered content when no messages
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img src="/nexus-ai-icon.png" alt="Logo" className="w-12 h-12 mr-2" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text mb-3">
              How
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 text-transparent bg-clip-text"> Nexus AI </span>
              can help you?
            </h1>
            <p className="text-gray-600 text-lg">
              Orchestrate a nexus of DeFi Agents to act on Sui
            </p>
          </div>
        )}

        {/* Input section */}
        <div className={`w-full ${messages.length > 0 ? '' : 'max-w-2xl mx-auto'}`}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the hive anything..."
              className="w-full px-6 py-4 pr-16 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 placeholder-gray-400 bg-white shadow-lg shadow-orange-100/20"
            />
            <button
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-orange-200/30 hover:shadow-orange-200/50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Only show sample questions when no messages */}
          {!messages.length && (
            <div className="mt-8">
              <SampleQuestions handleSend={handleSend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
