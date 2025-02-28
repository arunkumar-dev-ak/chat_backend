-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "hiddenForUserIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
