/*
  Warnings:

  - You are about to drop the `TicketReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketReply" DROP CONSTRAINT "TicketReply_ticketId_fkey";

-- DropTable
DROP TABLE "TicketReply";

-- CreateTable
CREATE TABLE "ticketReplies" (
    "id" TEXT NOT NULL,
    "recepientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketReplies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticketReplies_ticketId_key" ON "ticketReplies"("ticketId");

-- AddForeignKey
ALTER TABLE "ticketReplies" ADD CONSTRAINT "ticketReplies_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
