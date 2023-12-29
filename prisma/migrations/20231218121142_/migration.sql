-- CreateTable
CREATE TABLE `WebTech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `framework` VARCHAR(191) NOT NULL,
    `porfolioId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WebTech` ADD CONSTRAINT `WebTech_porfolioId_fkey` FOREIGN KEY (`porfolioId`) REFERENCES `Porfolio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
