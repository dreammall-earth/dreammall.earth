/*
  Warnings:

  - Added the required column `firstName` to the `NewsletterSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `NewsletterSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NewsletterSubscription` ADD COLUMN `firstName` VARCHAR(50) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(50) NOT NULL;
