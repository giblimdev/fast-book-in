/*
  Warnings:

  - You are about to drop the `HotelCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotelRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hotel_rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalendarAvailability" DROP CONSTRAINT "CalendarAvailability_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "HotelCard" DROP CONSTRAINT "HotelCard_hotelDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "HotelCard" DROP CONSTRAINT "HotelCard_hotelGroupId_fkey";

-- DropForeignKey
ALTER TABLE "HotelCard" DROP CONSTRAINT "HotelCard_hotelParkingId_fkey";

-- DropForeignKey
ALTER TABLE "HotelRoom" DROP CONSTRAINT "HotelRoom_hotelDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomUnavailability" DROP CONSTRAINT "RoomUnavailability_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomUnavailability" DROP CONSTRAINT "RoomUnavailability_hotelRoomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "TravelerRecommendation" DROP CONSTRAINT "TravelerRecommendation_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "_AccommodationTypeToHotelCard" DROP CONSTRAINT "_AccommodationTypeToHotelCard_B_fkey";

-- DropForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoomType" DROP CONSTRAINT "_CancellationPolicyToHotelRoomType_B_fkey";

-- DropForeignKey
ALTER TABLE "_DestinationToHotelCard" DROP CONSTRAINT "_DestinationToHotelCard_B_fkey";

-- DropForeignKey
ALTER TABLE "_HotelAmenityToHotelCard" DROP CONSTRAINT "_HotelAmenityToHotelCard_B_fkey";

-- DropForeignKey
ALTER TABLE "hotel_card_to_accessibility" DROP CONSTRAINT "hotel_card_to_accessibility_hotel_card_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_card_to_amenities" DROP CONSTRAINT "hotel_card_to_amenities_hotel_card_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_card_to_highlights" DROP CONSTRAINT "hotel_card_to_highlights_hotel_card_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_card_to_labels" DROP CONSTRAINT "hotel_card_to_labels_hotel_card_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_faqs" DROP CONSTRAINT "hotel_faqs_hotelCardId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_hotelCardId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_hotelRoomtypeId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_policies" DROP CONSTRAINT "hotel_policies_hotelCardId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_reviews" DROP CONSTRAINT "hotel_reviews_hotelCardId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_rooms" DROP CONSTRAINT "hotel_rooms_hotelCardId_fkey";

-- DropForeignKey
ALTER TABLE "hotelier_dashboards" DROP CONSTRAINT "hotelier_dashboards_hotelCardId_fkey";

-- DropForeignKey
ALTER TABLE "user_wish_lists" DROP CONSTRAINT "user_wish_lists_hotelCardId_fkey";

-- DropTable
DROP TABLE "HotelCard";

-- DropTable
DROP TABLE "HotelRoom";

-- DropTable
DROP TABLE "hotel_rooms";

-- CreateTable
CREATE TABLE "hotelCard" (
    "id" TEXT NOT NULL,
    "hotelDetailsId" TEXT,
    "name" TEXT NOT NULL,
    "idCity" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 20,
    "shortDescription" TEXT,
    "starRating" INTEGER,
    "overallRating" DOUBLE PRECISION,
    "ratingAdjective" TEXT,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "basePricePerNight" DOUBLE PRECISION NOT NULL,
    "regularPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "promoMessage" TEXT,
    "imageMessage" TEXT,
    "hotelGroupId" TEXT,
    "hotelParkingId" TEXT,

    CONSTRAINT "hotelCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotelRoomType" (
    "id" TEXT NOT NULL,
    "hotelCardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxGuests" INTEGER NOT NULL,
    "bedCount" INTEGER NOT NULL,
    "bedType" TEXT NOT NULL,
    "roomSize" DOUBLE PRECISION,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotelRoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotelRoom" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "hotelDetailsId" TEXT,

    CONSTRAINT "hotelRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotelRoomtypeId_fkey" FOREIGN KEY ("hotelRoomtypeId") REFERENCES "hotelRoomType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelCard" ADD CONSTRAINT "hotelCard_hotelGroupId_fkey" FOREIGN KEY ("hotelGroupId") REFERENCES "hotel_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelCard" ADD CONSTRAINT "hotelCard_hotelDetailsId_fkey" FOREIGN KEY ("hotelDetailsId") REFERENCES "hotel_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelCard" ADD CONSTRAINT "hotelCard_hotelParkingId_fkey" FOREIGN KEY ("hotelParkingId") REFERENCES "hotel_parking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelRoomType" ADD CONSTRAINT "hotelRoomType_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelRoom" ADD CONSTRAINT "hotelRoom_hotelDetailsId_fkey" FOREIGN KEY ("hotelDetailsId") REFERENCES "hotel_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_reviews" ADD CONSTRAINT "hotel_reviews_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_policies" ADD CONSTRAINT "hotel_policies_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_faqs" ADD CONSTRAINT "hotel_faqs_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wish_lists" ADD CONSTRAINT "user_wish_lists_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUnavailability" ADD CONSTRAINT "RoomUnavailability_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotelRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUnavailability" ADD CONSTRAINT "RoomUnavailability_hotelRoomTypeId_fkey" FOREIGN KEY ("hotelRoomTypeId") REFERENCES "hotelRoomType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarAvailability" ADD CONSTRAINT "CalendarAvailability_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotelRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotelRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelier_dashboards" ADD CONSTRAINT "hotelier_dashboards_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_highlights" ADD CONSTRAINT "hotel_card_to_highlights_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_labels" ADD CONSTRAINT "hotel_card_to_labels_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_accessibility" ADD CONSTRAINT "hotel_card_to_accessibility_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_amenities" ADD CONSTRAINT "hotel_card_to_amenities_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerRecommendation" ADD CONSTRAINT "TravelerRecommendation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToHotelCard" ADD CONSTRAINT "_DestinationToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "hotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccommodationTypeToHotelCard" ADD CONSTRAINT "_AccommodationTypeToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "hotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelAmenityToHotelCard" ADD CONSTRAINT "_HotelAmenityToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "hotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoomType" ADD CONSTRAINT "_CancellationPolicyToHotelRoomType_B_fkey" FOREIGN KEY ("B") REFERENCES "hotelRoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
