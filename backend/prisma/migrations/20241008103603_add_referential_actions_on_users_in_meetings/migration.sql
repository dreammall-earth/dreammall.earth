-- DropForeignKey
ALTER TABLE `UsersInMeetings` DROP FOREIGN KEY `UsersInMeetings_meetingId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersInMeetings` DROP FOREIGN KEY `UsersInMeetings_userId_fkey`;

-- AddForeignKey
ALTER TABLE `UsersInMeetings` ADD CONSTRAINT `UsersInMeetings_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `Meeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersInMeetings` ADD CONSTRAINT `UsersInMeetings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
