/*
  Warnings:

  - A unique constraint covering the columns `[pk]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `pk` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_pk_key` ON `User`(`pk`);
