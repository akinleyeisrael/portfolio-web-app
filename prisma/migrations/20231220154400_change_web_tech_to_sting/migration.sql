/*
  Warnings:

  - You are about to drop the column `porfolioId` on the `webtech` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `webtech` DROP FOREIGN KEY `WebTech_porfolioId_fkey`;

-- AlterTable
ALTER TABLE `porfolio` ADD COLUMN `webTechs` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `webtech` DROP COLUMN `porfolioId`;
