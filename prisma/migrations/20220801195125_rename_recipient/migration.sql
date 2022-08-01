/*
  Warnings:

  - You are about to drop the column `recepientEmail` on the `ticketReplies` table. All the data in the column will be lost.
  - Added the required column `recipientEmail` to the `ticketReplies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticketReplies" DROP COLUMN "recepientEmail",
ADD COLUMN     "recipientEmail" TEXT NOT NULL;
