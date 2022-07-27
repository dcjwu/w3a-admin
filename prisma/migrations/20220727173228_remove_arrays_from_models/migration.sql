/*
  Warnings:

  - You are about to drop the column `socialMediaLinks` on the `members` table. All the data in the column will be lost.
  - Added the required column `linkedinUrl` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "socialMediaLinks",
ADD COLUMN     "linkedinUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "keywords" SET NOT NULL,
ALTER COLUMN "keywords" SET DATA TYPE TEXT;
