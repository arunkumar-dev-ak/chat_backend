-- CreateTable
CREATE TABLE "ConversationMetaData" (
    "conversationId" TEXT NOT NULL,
    "lastMessageId" TEXT NOT NULL,
    "lastMessageCreatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationMetaData_pkey" PRIMARY KEY ("conversationId")
);

-- AddForeignKey
ALTER TABLE "ConversationMetaData" ADD CONSTRAINT "ConversationMetaData_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
