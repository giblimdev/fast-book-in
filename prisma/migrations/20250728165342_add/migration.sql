/*
  Warnings:

  - You are about to drop the `_CancellationPolicyToHotelRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CityToGaleryImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DestinationToGaleryImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GaleryImageToHotelCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GaleryImageToHotelRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalendarAvailability" DROP CONSTRAINT "CalendarAvailability_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomUnavailability" DROP CONSTRAINT "RoomUnavailability_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoom" DROP CONSTRAINT "_CancellationPolicyToHotelRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoom" DROP CONSTRAINT "_CancellationPolicyToHotelRoom_B_fkey";

-- DropForeignKey
ALTER TABLE "_CityToGaleryImage" DROP CONSTRAINT "_CityToGaleryImage_A_fkey";

-- DropForeignKey
ALTER TABLE "_CityToGaleryImage" DROP CONSTRAINT "_CityToGaleryImage_B_fkey";

-- DropForeignKey
ALTER TABLE "_DestinationToGaleryImage" DROP CONSTRAINT "_DestinationToGaleryImage_A_fkey";

-- DropForeignKey
ALTER TABLE "_DestinationToGaleryImage" DROP CONSTRAINT "_DestinationToGaleryImage_B_fkey";

-- DropForeignKey
ALTER TABLE "_GaleryImageToHotelCard" DROP CONSTRAINT "_GaleryImageToHotelCard_A_fkey";

-- DropForeignKey
ALTER TABLE "_GaleryImageToHotelCard" DROP CONSTRAINT "_GaleryImageToHotelCard_B_fkey";

-- DropForeignKey
ALTER TABLE "_GaleryImageToHotelRoom" DROP CONSTRAINT "_GaleryImageToHotelRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_GaleryImageToHotelRoom" DROP CONSTRAINT "_GaleryImageToHotelRoom_B_fkey";

-- DropForeignKey
ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_labelId_fkey";

-- AlterTable
ALTER TABLE "RoomUnavailability" ADD COLUMN     "hotelRoomTypeId" TEXT;

-- AlterTable
ALTER TABLE "accommodation_types" ADD COLUMN     "images" TEXT;

-- AlterTable
ALTER TABLE "hotel_images" ADD COLUMN     "accommodationTypeId" TEXT,
ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "destinationId" TEXT,
ADD COLUMN     "hotelCardId" TEXT,
ADD COLUMN     "hotelRoomtypeId" TEXT,
ADD COLUMN     "landmarkId" TEXT;

-- AlterTable
ALTER TABLE "labels" ADD COLUMN     "images" TEXT;

-- DropTable
DROP TABLE "_CancellationPolicyToHotelRoom";

-- DropTable
DROP TABLE "_CityToGaleryImage";

-- DropTable
DROP TABLE "_DestinationToGaleryImage";

-- DropTable
DROP TABLE "_GaleryImageToHotelCard";

-- DropTable
DROP TABLE "_GaleryImageToHotelRoom";

-- CreateTable
CREATE TABLE "HotelRoom" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "hotelDetailsId" TEXT,

    CONSTRAINT "HotelRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CancellationPolicyToHotelRoomType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CancellationPolicyToHotelRoomType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CancellationPolicyToHotelRoomType_B_index" ON "_CancellationPolicyToHotelRoomType"("B");

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "HotelCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotelRoomtypeId_fkey" FOREIGN KEY ("hotelRoomtypeId") REFERENCES "hotel_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_landmarkId_fkey" FOREIGN KEY ("landmarkId") REFERENCES "landmarks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelRoom" ADD CONSTRAINT "HotelRoom_hotelDetailsId_fkey" FOREIGN KEY ("hotelDetailsId") REFERENCES "hotel_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUnavailability" ADD CONSTRAINT "RoomUnavailability_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "HotelRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUnavailability" ADD CONSTRAINT "RoomUnavailability_hotelRoomTypeId_fkey" FOREIGN KEY ("hotelRoomTypeId") REFERENCES "hotel_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarAvailability" ADD CONSTRAINT "CalendarAvailability_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "HotelRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "HotelRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoomType" ADD CONSTRAINT "_CancellationPolicyToHotelRoomType_A_fkey" FOREIGN KEY ("A") REFERENCES "CancellationPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoomType" ADD CONSTRAINT "_CancellationPolicyToHotelRoomType_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
