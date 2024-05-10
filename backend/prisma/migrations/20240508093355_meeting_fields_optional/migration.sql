-- AlterTable
ALTER TABLE `Meeting` MODIFY `attendeePW` VARCHAR(64) NULL,
    MODIFY `moderatorPW` VARCHAR(64) NULL,
    MODIFY `voiceBridge` INTEGER NULL,
    MODIFY `dialNumber` VARCHAR(64) NULL,
    MODIFY `createTime` INTEGER NULL,
    MODIFY `createDate` DATETIME(3) NULL;
