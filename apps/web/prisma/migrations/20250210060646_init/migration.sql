-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('user', 'llm');

-- CreateTable
CREATE TABLE "chat_histories" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sender" "SenderType" NOT NULL,
    "is_html" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_history_id" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_histories_wallet_address_idx" ON "chat_histories"("wallet_address");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_history_id_fkey" FOREIGN KEY ("chat_history_id") REFERENCES "chat_histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
