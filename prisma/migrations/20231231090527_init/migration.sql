/*
  Warnings:

  - You are about to drop the column `webTechs` on the `Porfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Porfolio" DROP COLUMN "webTechs";

-- AlterTable
ALTER TABLE "WebTech" ADD COLUMN     "porfolioId" INTEGER;

-- AddForeignKey
ALTER TABLE "WebTech" ADD CONSTRAINT "WebTech_porfolioId_fkey" FOREIGN KEY ("porfolioId") REFERENCES "Porfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
