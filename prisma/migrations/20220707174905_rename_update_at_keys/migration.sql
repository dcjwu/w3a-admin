/*
  Warnings:

  - You are about to drop the column `UpdatedAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "UpdatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "UpdatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "UpdatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
