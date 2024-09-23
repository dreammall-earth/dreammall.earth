/*
  Warnings:

  - You are about to alter the column `type` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `type` ENUM('CONTACTFORM_SEND', 'NEWSLETTER_CONFIRM', 'NEWSLETTER_SUBSCRIBE', 'CREATE_USER', 'CREATE_MY_TABLE', 'UPDATE_MY_TABLE', 'UPDATE_TABLE', 'CREATE_TABLE') NOT NULL;
