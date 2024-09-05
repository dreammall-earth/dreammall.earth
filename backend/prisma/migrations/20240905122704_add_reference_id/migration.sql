/*
  Warnings:

  - A unique constraint covering the columns `[referenceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `referenceId` VARCHAR(140) NOT NULL DEFAULT UPPER(LEFT(UUID(), 8));

-- CreateIndex
CREATE UNIQUE INDEX `User_referenceId_key` ON `User`(`referenceId`);
