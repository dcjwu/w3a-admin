/*
  Warnings:

  - Added the required column `settingValue` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "settingValue" TEXT NOT NULL;
