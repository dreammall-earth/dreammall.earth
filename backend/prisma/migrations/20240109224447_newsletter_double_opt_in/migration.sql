-- AlterTable
ALTER TABLE `NewsletterSubscription` MODIFY `email` VARCHAR(254) NOT NULL;

-- CreateTable
CREATE TABLE `NewsletterDoubleOptIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(16) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validTill` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `brevoSuccess` DATETIME(3) NULL,

    UNIQUE INDEX `NewsletterDoubleOptIn_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
