import { prisma } from '../utils/db';
import type { Message as PrismaMessage, ChatHistory as PrismaChatHistory } from '@prisma/client';

export type IChatHistory = PrismaChatHistory & { messages: PrismaMessage[] };

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
export async function addMessage(
  chatHistoryId: string,
  message: { text: string; sender: 'user' | 'llm'; timestamp: Date; isHTML: boolean }
) {
  return prisma.message.create({
    data: {
      content: message.text || '',
      sender: message.sender,
      chatHistory: {
        connect: { id: chatHistoryId }
      }
    }
  });
}

export default {
  createChatHistory,
  findChatHistoryByWallet,
  addMessage,
};
