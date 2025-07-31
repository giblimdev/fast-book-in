/*
  Warnings:

  - You are about to drop the column `latitude` on the `HotelCard` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `HotelCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HotelCard" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
