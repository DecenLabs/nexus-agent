import { prisma } from '../utils/db';
import type { Message, ChatHistory as PrismaChatHistory } from '@prisma/client'; 

export type IMessage = Message;
export type IChatHistory = PrismaChatHistory & { messages: Message[] };

// Create a new chat history
export async function createChatHistory(walletAddress: string) {
  return prisma.chatHistory.create({
    data: {
      walletAddress,
    },
    include: {
      messages: true,
    },
  });
}

// Find chat history by wallet address
export async function findChatHistoryByWallet(walletAddress: string) {
  return prisma.chatHistory.findFirst({
    where: {
      walletAddress,
    },
    include: {
      messages: true,
    },
  });
}

// Add message to chat history
export async function addMessage(chatHistoryId: string, message: Omit<IMessage, 'id' | 'chatHistoryId'>) {
  return prisma.message.create({
    data: {
      ...message,
      chatHistory: {
        connect: {
          id: chatHistoryId,
        },
      },
    },
  });
}

export default {
  createChatHistory,
  findChatHistoryByWallet,
  addMessage,
};
