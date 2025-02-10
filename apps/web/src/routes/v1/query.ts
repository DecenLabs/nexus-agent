import { Router } from 'express';
import { Request, Response } from 'express';
import { config } from '../../config';
import Agent from '@atoma-agents/sui-agent/src/agents/SuiAgent';
import * as ChatHistory from '../../models/ChatHistory';
import { PrismaClient } from '@prisma/client';

const suiAgent = new Agent(config.atomaSdkBearerAuth);
const queryRouter: Router = Router();
const prisma = new PrismaClient();

// Health check endpoint
queryRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// Query endpoint
const handleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, walletAddress } = req.body;

    if (!query) {
      res.status(400).json({
        error: 'Missing query in request body'
      });

      return;
    }
    // Get agent response first
    const result = await suiAgent.SuperVisorAgent(query, walletAddress);

    // Only try to save chat history if walletAddress is provided
    if (walletAddress) {
      try {
        // Get or create chat history for this wallet
        let chatHistory = await ChatHistory.findChatHistoryByWallet(walletAddress);
        if (!chatHistory) {
          chatHistory = await ChatHistory.createChatHistory(walletAddress);
        }

        // Add user message
        await ChatHistory.addMessage(chatHistory.id, {
          text: query || '',
          sender: 'user',
          timestamp: new Date(),
          isHTML: false,
        });

        // Add agent response
        await ChatHistory.addMessage(chatHistory.id, {
          text: typeof result[0].response === 'string'
            ? result[0].response
            : JSON.stringify(result[0].response),
          sender: 'llm',
          isHTML: true,
          timestamp: new Date(),
        });
      } catch (chatError) {
        console.warn('Error saving chat history:', chatError);
        // Continue with the response even if chat history fails
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error handling query:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get chat history endpoint
queryRouter.get('/history/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        chatHistoryId: chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    const formattedMessages = messages.map(msg => ({
      text: msg.content,
      sender: msg.sender,
      isHTML: msg.sender === 'llm',
    }));
    
    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get all chats for a wallet
queryRouter.get('/all-chats/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    console.log('Received request for wallet:', walletAddress);

    const chats = await prisma.chatHistory.findMany({
      where: {
        walletAddress: walletAddress,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log('Database query result:', chats);

    const formattedChats = chats.map((chat) => {
      // Get the first user message for the chat title
      const firstUserMessage = chat.messages.find(msg => msg.sender === 'user');
      return {
        id: chat.id,
        text: firstUserMessage?.content || 'Untitled Chat',
        timestamp: chat.updatedAt,
        messages: chat.messages.map(msg => ({
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.createdAt
        }))
      };
    });

    console.log('Sending response:', formattedChats);
    res.status(200).json(formattedChats);
  } catch (error) {
    console.error('Error in /all-chats endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug endpoint to check database content
queryRouter.get('/debug/chats/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    // Get chat histories
    const chatHistories = await prisma.chatHistory.findMany({
      where: { walletAddress },
      include: { messages: true },
    });

    // Get message count
    const messageCount = await prisma.message.count({
      where: {
        chatHistory: {
          walletAddress,
        },
      },
    });

    res.status(200).json({
      chatHistories,
      messageCount,
      diagnostics: {
        timestamp: new Date(),
        walletAddress,
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Debug endpoint failed', details: error });
  }
});

// Handle unsupported methods
const handleUnsupportedMethod = (req: Request, res: Response): void => {
  res.status(405).json({
    error: 'Method not allowed'
  });
};

queryRouter.post('/', handleQuery);
queryRouter.all('/', handleUnsupportedMethod);

// Add at the beginning of the routes
queryRouter.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Query router is working' });
});

export default queryRouter;
