/*
  Warnings:

  - You are about to drop the `_porfoliotowebtech` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_porfoliotowebtech` DROP FOREIGN KEY `_PorfolioToWebTech_A_fkey`;

-- DropForeignKey
ALTER TABLE `_porfoliotowebtech` DROP FOREIGN KEY `_PorfolioToWebTech_B_fkey`;

-- DropTable
DROP TABLE `_porfoliotowebtech`;

-- AddForeignKey
ALTER TABLE `WebTech` ADD CONSTRAINT `WebTech_porfolioId_fkey` FOREIGN KEY (`porfolioId`) REFERENCES `Porfolio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
