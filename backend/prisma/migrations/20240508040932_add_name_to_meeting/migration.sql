/*
  Warnings:

  - Added the required column `name` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Meeting` ADD COLUMN `name` VARCHAR(254) NOT NULL;
