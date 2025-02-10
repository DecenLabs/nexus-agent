/*
  Warnings:

  - You are about to drop the column `is_html` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `chat_histories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_history_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "is_html",
DROP COLUMN "text",
DROP COLUMN "timestamp",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "chat_histories";

-- CreateTable
CREATE TABLE "chat_history" (
    "id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_history_id_fkey" FOREIGN KEY ("chat_history_id") REFERENCES "chat_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
