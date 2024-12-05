-- CreateTable
CREATE TABLE `InvitationLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(36) NOT NULL,
    `userId` INTEGER NOT NULL,
    `acceptedUserId` INTEGER NULL,

    UNIQUE INDEX `InvitationLink_code_key`(`code`),
    UNIQUE INDEX `InvitationLink_acceptedUserId_key`(`acceptedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvitationLink` ADD CONSTRAINT `InvitationLink_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvitationLink` ADD CONSTRAINT `InvitationLink_acceptedUserId_fkey` FOREIGN KEY (`acceptedUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
