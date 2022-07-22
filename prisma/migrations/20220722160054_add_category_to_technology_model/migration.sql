-- CreateEnum
CREATE TYPE "TechnologyCategories" AS ENUM ('FRAMEWORKS', 'DBMS', 'BLOCKCHAINS', 'LANGUAGES', 'CLOUD_PLATFORMS');

-- AlterTable
ALTER TABLE "technologies" ADD COLUMN     "category" "TechnologyCategories";
