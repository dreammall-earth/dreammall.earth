/*
  Warnings:

  - A unique constraint covering the columns `[temporaryID]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Meeting` ADD COLUMN `temporaryID` VARCHAR(36) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Meeting_temporaryID_key` ON `Meeting`(`temporaryID`);
