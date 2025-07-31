/*
  Warnings:

  - You are about to drop the column `accommodationTypeId` on the `HotelCard` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationPolicy` on the `HotelCard` table. All the data in the column will be lost.
  - You are about to drop the column `destinationId` on the `HotelCard` table. All the data in the column will be lost.
  - You are about to drop the column `detailsId` on the `HotelCard` table. All the data in the column will be lost.
  - You are about to drop the column `HotelCardid` on the `hotel_details` table. All the data in the column will be lost.
  - You are about to drop the column `idHotelCard` on the `hotel_details` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HotelCard" DROP CONSTRAINT "HotelCard_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_details" DROP CONSTRAINT "hotel_details_HotelCardid_fkey";

-- AlterTable
ALTER TABLE "HotelCard" DROP COLUMN "accommodationTypeId",
DROP COLUMN "cancellationPolicy",
DROP COLUMN "destinationId",
DROP COLUMN "detailsId",
ADD COLUMN     "hotelDetailsId" TEXT;

-- AlterTable
ALTER TABLE "hotel_details" DROP COLUMN "HotelCardid",
DROP COLUMN "idHotelCard",
ADD COLUMN     "hotelCardid" TEXT;

-- CreateTable
CREATE TABLE "_DestinationToHotelCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DestinationToHotelCard_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DestinationToHotelCard_B_index" ON "_DestinationToHotelCard"("B");

-- AddForeignKey
ALTER TABLE "HotelCard" ADD CONSTRAINT "HotelCard_hotelDetailsId_fkey" FOREIGN KEY ("hotelDetailsId") REFERENCES "hotel_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToHotelCard" ADD CONSTRAINT "_DestinationToHotelCard_A_fkey" FOREIGN KEY ("A") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToHotelCard" ADD CONSTRAINT "_DestinationToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
