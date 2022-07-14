-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVE';
