
export type Message = {
    id: string;
    content: string;
    sender: 'user' | 'llm';
    createdAt: Date;
    chatHistoryId: string;
};

export type ChatHistory = {
    id: string;
    walletAddress: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}; 