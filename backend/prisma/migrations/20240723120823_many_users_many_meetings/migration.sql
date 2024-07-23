-- AlterTable
ALTER TABLE `Meeting` ADD COLUMN `public` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `UsersInMeetings` (
    `meetingId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` VARCHAR(12) NOT NULL DEFAULT 'MODERATOR',

    PRIMARY KEY (`meetingId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsersInMeetings` ADD CONSTRAINT `UsersInMeetings_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `Meeting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersInMeetings` ADD CONSTRAINT `UsersInMeetings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
