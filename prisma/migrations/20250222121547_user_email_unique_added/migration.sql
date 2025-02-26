/*
  Warnings:

  - A unique constraint covering the columns `[mobileNo,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_mobileNo_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNo_email_key" ON "User"("mobileNo", "email");
