-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "isSent" SET DEFAULT false,
ALTER COLUMN "isViewed" SET DEFAULT false,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "mediaUrl" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ConversationMetaData_conversationId_idx" ON "ConversationMetaData"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationMetaData_lastMessageId_idx" ON "ConversationMetaData"("lastMessageId");
