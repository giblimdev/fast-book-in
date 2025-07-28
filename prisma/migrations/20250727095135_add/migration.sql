/*
  Warnings:

  - You are about to drop the column `images` on the `hotel_rooms` table. All the data in the column will be lost.
  - You are about to drop the `_HotelCardToHotelImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HotelCardToHotelParking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `calendar_availabilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HotelCard" DROP CONSTRAINT "HotelCard_detailsId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_reservationId_fkey";

-- DropForeignKey
ALTER TABLE "_HotelCardToHotelImage" DROP CONSTRAINT "_HotelCardToHotelImage_A_fkey";

-- DropForeignKey
ALTER TABLE "_HotelCardToHotelImage" DROP CONSTRAINT "_HotelCardToHotelImage_B_fkey";

-- DropForeignKey
ALTER TABLE "_HotelCardToHotelParking" DROP CONSTRAINT "_HotelCardToHotelParking_A_fkey";

-- DropForeignKey
ALTER TABLE "_HotelCardToHotelParking" DROP CONSTRAINT "_HotelCardToHotelParking_B_fkey";

-- DropForeignKey
ALTER TABLE "calendar_availabilities" DROP CONSTRAINT "calendar_availabilities_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_hotelRoomId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_userId_fkey";

-- AlterTable
ALTER TABLE "HotelCard" ADD COLUMN     "hotelParkingId" TEXT;

-- AlterTable
ALTER TABLE "hotel_details" ADD COLUMN     "HotelCardid" TEXT;

-- AlterTable
ALTER TABLE "hotel_images" ADD COLUMN     "countryId" TEXT,
ADD COLUMN     "labelId" TEXT,
ADD COLUMN     "neighborhoodId" TEXT;

-- AlterTable
ALTER TABLE "hotel_reviews" ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "stayDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "hotel_rooms" DROP COLUMN "images";

-- DropTable
DROP TABLE "_HotelCardToHotelImage";

-- DropTable
DROP TABLE "_HotelCardToHotelParking";

-- DropTable
DROP TABLE "calendar_availabilities";

-- DropTable
DROP TABLE "reservations";

-- CreateTable
CREATE TABLE "CancellationPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "refundPercentage" INTEGER NOT NULL,
    "daysBeforeCheckIn" INTEGER NOT NULL,
    "penaltyFee" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancellationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomUnavailability" (
    "id" TEXT NOT NULL,
    "hotelRoomId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomUnavailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarAvailability" (
    "id" TEXT NOT NULL,
    "hotelRoomId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION,
    "minStay" INTEGER DEFAULT 1,
    "maxStay" INTEGER,
    "stopSell" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelRoomId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "taxes" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancellationReason" TEXT,
    "cancellationDate" TIMESTAMP(3),
    "specialRequests" TEXT,
    "cancellationPolicyId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancellation" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "cancellationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedBy" TEXT,
    "reasonCode" TEXT,
    "reasonDetails" TEXT,
    "refundAmount" DOUBLE PRECISION NOT NULL,
    "refundMethod" TEXT,
    "refundStatus" TEXT NOT NULL DEFAULT 'pending',
    "refundReference" TEXT,
    "policyId" TEXT,
    "penaltyApplied" DOUBLE PRECISION,
    "nightsCharged" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "cancellationId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostNotification" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "client_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traveler_loyalties" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "tier" TEXT NOT NULL DEFAULT 'basic',
    "membershipNumber" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivity" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "newsletterOptIn" BOOLEAN NOT NULL DEFAULT true,
    "partnerOffersOptIn" BOOLEAN NOT NULL DEFAULT false,
    "totalStays" INTEGER NOT NULL DEFAULT 0,
    "totalNights" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traveler_loyalties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_rewards" (
    "id" TEXT NOT NULL,
    "loyaltyId" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pointsCost" INTEGER NOT NULL,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "loyaltyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationHistory" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedById" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReservationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotelier_dashboards" (
    "id" TEXT NOT NULL,
    "hotelCardId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "upcomingBookings" INTEGER NOT NULL DEFAULT 0,
    "currentGuests" INTEGER NOT NULL DEFAULT 0,
    "cancellationRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageStayLength" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "occupancyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "revpar" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "positiveReviews" INTEGER NOT NULL DEFAULT 0,
    "negativeReviews" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingRequests" INTEGER NOT NULL DEFAULT 0,
    "maintenanceIssues" INTEGER NOT NULL DEFAULT 0,
    "lowInventoryItems" INTEGER NOT NULL DEFAULT 0,
    "availableRooms" INTEGER NOT NULL DEFAULT 0,
    "occupiedRooms" INTEGER NOT NULL DEFAULT 0,
    "maintenanceRooms" INTEGER NOT NULL DEFAULT 0,
    "lastBookingDate" TIMESTAMP(3),
    "nextCheckIn" TIMESTAMP(3),
    "nextCheckOut" TIMESTAMP(3),
    "widgetConfig" JSONB,
    "performanceHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotelier_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_dashboards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "upcomingBookings" INTEGER NOT NULL DEFAULT 0,
    "pastBookings" INTEGER NOT NULL DEFAULT 0,
    "cancelledBookings" INTEGER NOT NULL DEFAULT 0,
    "favoriteHotelType" TEXT,
    "wishlistCount" INTEGER NOT NULL DEFAULT 0,
    "reviewsWritten" INTEGER NOT NULL DEFAULT 0,
    "commentsWritten" INTEGER NOT NULL DEFAULT 0,
    "averageRatingGiven" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastBookingDate" TIMESTAMP(3),
    "lastReviewDate" TIMESTAMP(3),
    "lastLoginDate" TIMESTAMP(3),
    "recommendedHotels" TEXT[],
    "trendingInArea" TEXT[],
    "preferredView" TEXT DEFAULT 'overview',
    "hiddenSections" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelerRecommendation" (
    "travelerId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "TravelerRecommendation_pkey" PRIMARY KEY ("travelerId","hotelId")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "passportNumber" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CityToGaleryImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CityToGaleryImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DestinationToGaleryImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DestinationToGaleryImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GaleryImageToHotelCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GaleryImageToHotelCard_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GaleryImageToHotelRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GaleryImageToHotelRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CancellationPolicyToHotelRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CancellationPolicyToHotelRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PostCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PostTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "RoomUnavailability_hotelRoomId_startDate_endDate_idx" ON "RoomUnavailability"("hotelRoomId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "CalendarAvailability_hotelRoomId_isAvailable_idx" ON "CalendarAvailability"("hotelRoomId", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarAvailability_hotelRoomId_date_key" ON "CalendarAvailability"("hotelRoomId", "date");

-- CreateIndex
CREATE INDEX "Reservation_hotelRoomId_checkIn_checkOut_idx" ON "Reservation"("hotelRoomId", "checkIn", "checkOut");

-- CreateIndex
CREATE UNIQUE INDEX "Cancellation_reservationId_key" ON "Cancellation"("reservationId");

-- CreateIndex
CREATE INDEX "Cancellation_reservationId_idx" ON "Cancellation"("reservationId");

-- CreateIndex
CREATE INDEX "Cancellation_cancellationDate_idx" ON "Cancellation"("cancellationDate");

-- CreateIndex
CREATE INDEX "Cancellation_refundStatus_idx" ON "Cancellation"("refundStatus");

-- CreateIndex
CREATE INDEX "Refund_cancellationId_idx" ON "Refund"("cancellationId");

-- CreateIndex
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- CreateIndex
CREATE INDEX "HostNotification_dashboardId_idx" ON "HostNotification"("dashboardId");

-- CreateIndex
CREATE INDEX "HostNotification_isRead_idx" ON "HostNotification"("isRead");

-- CreateIndex
CREATE INDEX "HostNotification_createdAt_idx" ON "HostNotification"("createdAt");

-- CreateIndex
CREATE INDEX "client_notifications_userId_isRead_idx" ON "client_notifications"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "traveler_loyalties_userId_key" ON "traveler_loyalties"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "traveler_loyalties_membershipNumber_key" ON "traveler_loyalties"("membershipNumber");

-- CreateIndex
CREATE INDEX "traveler_loyalties_userId_idx" ON "traveler_loyalties"("userId");

-- CreateIndex
CREATE INDEX "traveler_loyalties_tier_idx" ON "traveler_loyalties"("tier");

-- CreateIndex
CREATE INDEX "traveler_loyalties_points_idx" ON "traveler_loyalties"("points");

-- CreateIndex
CREATE INDEX "loyalty_rewards_loyaltyId_idx" ON "loyalty_rewards"("loyaltyId");

-- CreateIndex
CREATE INDEX "loyalty_rewards_isRedeemed_idx" ON "loyalty_rewards"("isRedeemed");

-- CreateIndex
CREATE INDEX "loyalty_transactions_loyaltyId_idx" ON "loyalty_transactions"("loyaltyId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_type_idx" ON "loyalty_transactions"("type");

-- CreateIndex
CREATE INDEX "loyalty_transactions_createdAt_idx" ON "loyalty_transactions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "hotelier_dashboards_hotelCardId_key" ON "hotelier_dashboards"("hotelCardId");

-- CreateIndex
CREATE INDEX "hotelier_dashboards_hotelCardId_idx" ON "hotelier_dashboards"("hotelCardId");

-- CreateIndex
CREATE UNIQUE INDEX "client_dashboards_userId_key" ON "client_dashboards"("userId");

-- CreateIndex
CREATE INDEX "client_dashboards_userId_idx" ON "client_dashboards"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_idx" ON "BlogPost"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Guest_reservationId_idx" ON "Guest"("reservationId");

-- CreateIndex
CREATE INDEX "_CityToGaleryImage_B_index" ON "_CityToGaleryImage"("B");

-- CreateIndex
CREATE INDEX "_DestinationToGaleryImage_B_index" ON "_DestinationToGaleryImage"("B");

-- CreateIndex
CREATE INDEX "_GaleryImageToHotelCard_B_index" ON "_GaleryImageToHotelCard"("B");

-- CreateIndex
CREATE INDEX "_GaleryImageToHotelRoom_B_index" ON "_GaleryImageToHotelRoom"("B");

-- CreateIndex
CREATE INDEX "_CancellationPolicyToHotelRoom_B_index" ON "_CancellationPolicyToHotelRoom"("B");

-- CreateIndex
CREATE INDEX "_PostCategories_B_index" ON "_PostCategories"("B");

-- CreateIndex
CREATE INDEX "_PostTags_B_index" ON "_PostTags"("B");

-- CreateIndex
CREATE INDEX "hotel_reviews_hotelCardId_idx" ON "hotel_reviews"("hotelCardId");

-- CreateIndex
CREATE INDEX "hotel_reviews_userId_idx" ON "hotel_reviews"("userId");

-- CreateIndex
CREATE INDEX "hotel_reviews_parentId_idx" ON "hotel_reviews"("parentId");

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelCard" ADD CONSTRAINT "HotelCard_hotelParkingId_fkey" FOREIGN KEY ("hotelParkingId") REFERENCES "hotel_parking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_details" ADD CONSTRAINT "hotel_details_HotelCardid_fkey" FOREIGN KEY ("HotelCardid") REFERENCES "HotelCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_reviews" ADD CONSTRAINT "hotel_reviews_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "hotel_reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUnavailability" ADD CONSTRAINT "RoomUnavailability_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarAvailability" ADD CONSTRAINT "CalendarAvailability_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_cancellationPolicyId_fkey" FOREIGN KEY ("cancellationPolicyId") REFERENCES "CancellationPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancellation" ADD CONSTRAINT "Cancellation_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "CancellationPolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_cancellationId_fkey" FOREIGN KEY ("cancellationId") REFERENCES "Cancellation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostNotification" ADD CONSTRAINT "HostNotification_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "hotelier_dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_notifications" ADD CONSTRAINT "client_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traveler_loyalties" ADD CONSTRAINT "traveler_loyalties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_rewards" ADD CONSTRAINT "loyalty_rewards_loyaltyId_fkey" FOREIGN KEY ("loyaltyId") REFERENCES "traveler_loyalties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_loyaltyId_fkey" FOREIGN KEY ("loyaltyId") REFERENCES "traveler_loyalties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationHistory" ADD CONSTRAINT "ReservationHistory_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelier_dashboards" ADD CONSTRAINT "hotelier_dashboards_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "HotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_dashboards" ADD CONSTRAINT "client_dashboards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerRecommendation" ADD CONSTRAINT "TravelerRecommendation_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "client_dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerRecommendation" ADD CONSTRAINT "TravelerRecommendation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "HotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CityToGaleryImage" ADD CONSTRAINT "_CityToGaleryImage_A_fkey" FOREIGN KEY ("A") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CityToGaleryImage" ADD CONSTRAINT "_CityToGaleryImage_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToGaleryImage" ADD CONSTRAINT "_DestinationToGaleryImage_A_fkey" FOREIGN KEY ("A") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToGaleryImage" ADD CONSTRAINT "_DestinationToGaleryImage_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GaleryImageToHotelCard" ADD CONSTRAINT "_GaleryImageToHotelCard_A_fkey" FOREIGN KEY ("A") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GaleryImageToHotelCard" ADD CONSTRAINT "_GaleryImageToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GaleryImageToHotelRoom" ADD CONSTRAINT "_GaleryImageToHotelRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GaleryImageToHotelRoom" ADD CONSTRAINT "_GaleryImageToHotelRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoom" ADD CONSTRAINT "_CancellationPolicyToHotelRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "CancellationPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CancellationPolicyToHotelRoom" ADD CONSTRAINT "_CancellationPolicyToHotelRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostCategories" ADD CONSTRAINT "_PostCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostCategories" ADD CONSTRAINT "_PostCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags" ADD CONSTRAINT "_PostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTags" ADD CONSTRAINT "_PostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
