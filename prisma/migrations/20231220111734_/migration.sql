/*
  Warnings:

  - You are about to drop the column `porfolioId` on the `webtech` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `WebTech_porfolioId_fkey` ON `webtech`;

-- AlterTable
ALTER TABLE `webtech` DROP COLUMN `porfolioId`;
