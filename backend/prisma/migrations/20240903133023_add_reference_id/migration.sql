/*
  Warnings:

  - A unique constraint covering the columns `[referenceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referenceId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `referenceId` VARCHAR(140) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_referenceId_key` ON `User`(`referenceId`);
