/*
  Warnings:

  - Added the required column `updatedAt` to the `ConversationMetaData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConversationMetaData" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "lastMessageCreatedAt" SET DEFAULT CURRENT_TIMESTAMP;
