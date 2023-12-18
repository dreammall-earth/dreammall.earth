-- AlterTable
ALTER TABLE `NewsletterSubscription` ADD COLUMN `firstName` VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN `lastName` VARCHAR(50) NOT NULL DEFAULT '';
