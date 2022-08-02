/*
  Warnings:

  - A unique constraint covering the columns `[settingName]` on the table `settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "settings_settingName_key" ON "settings"("settingName");
