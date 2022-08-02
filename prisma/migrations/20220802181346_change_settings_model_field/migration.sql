/*
  Warnings:

  - You are about to drop the column `webhookUrl` on the `settings` table. All the data in the column will be lost.
  - Added the required column `settingName` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" DROP COLUMN "webhookUrl",
ADD COLUMN     "settingName" TEXT NOT NULL;
