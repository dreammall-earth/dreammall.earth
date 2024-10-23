-- CreateTable
CREATE TABLE `MallTalkHistory` (
    `fromId` INTEGER NOT NULL,
    `toId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(12) NOT NULL DEFAULT 'UNKNOWN',

    PRIMARY KEY (`fromId`, `toId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MallTalkHistory` ADD CONSTRAINT `MallTalkHistory_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MallTalkHistory` ADD CONSTRAINT `MallTalkHistory_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
