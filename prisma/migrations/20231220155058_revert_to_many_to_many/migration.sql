/*
  Warnings:

  - You are about to drop the column `webTechs` on the `porfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `porfolio` DROP COLUMN `webTechs`;

-- AlterTable
ALTER TABLE `webtech` ADD COLUMN `porfolioId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_PorfolioToWebTech` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PorfolioToWebTech_AB_unique`(`A`, `B`),
    INDEX `_PorfolioToWebTech_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PorfolioToWebTech` ADD CONSTRAINT `_PorfolioToWebTech_A_fkey` FOREIGN KEY (`A`) REFERENCES `Porfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PorfolioToWebTech` ADD CONSTRAINT `_PorfolioToWebTech_B_fkey` FOREIGN KEY (`B`) REFERENCES `WebTech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
