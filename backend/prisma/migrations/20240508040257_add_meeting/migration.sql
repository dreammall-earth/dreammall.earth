/*
  Warnings:

  - A unique constraint covering the columns `[meetingId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `meetingId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Meeting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `meetingID` VARCHAR(36) NOT NULL,
    `attendeePW` VARCHAR(64) NOT NULL,
    `moderatorPW` VARCHAR(64) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `voiceBridge` INTEGER NOT NULL,
    `dialNumber` VARCHAR(64) NOT NULL,
    `createTime` INTEGER NOT NULL,
    `createDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Meeting_meetingID_key`(`meetingID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_meetingId_key` ON `User`(`meetingId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `Meeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
