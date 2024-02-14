/*
  Warnings:

  - You are about to drop the column `brevoSuccess` on the `NewsletterSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `NewsletterSubscription` DROP COLUMN `brevoSuccess`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `email` VARCHAR(254) NOT NULL;

-- CreateTable
CREATE TABLE `NewsletterPreOptIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `code` VARCHAR(16) NOT NULL,
    `validTill` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `brevoSuccessMail` DATETIME(3) NULL,
    `brevoSuccessList` DATETIME(3) NULL,

    UNIQUE INDEX `NewsletterPreOptIn_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
