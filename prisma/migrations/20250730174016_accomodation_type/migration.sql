-- DropForeignKey
ALTER TABLE "HotelCard" DROP CONSTRAINT "HotelCard_accommodationTypeId_fkey";

-- AlterTable
ALTER TABLE "HotelCard" ALTER COLUMN "starRating" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_AccommodationTypeToHotelCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccommodationTypeToHotelCard_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AccommodationTypeToHotelCard_B_index" ON "_AccommodationTypeToHotelCard"("B");

-- AddForeignKey
ALTER TABLE "_AccommodationTypeToHotelCard" ADD CONSTRAINT "_AccommodationTypeToHotelCard_A_fkey" FOREIGN KEY ("A") REFERENCES "accommodation_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccommodationTypeToHotelCard" ADD CONSTRAINT "_AccommodationTypeToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
