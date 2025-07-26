-- AlterTable
ALTER TABLE "hotel_details" ADD COLUMN     "checkInTime" TEXT,
ADD COLUMN     "checkOutTime" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "numberOfFloors" INTEGER,
ADD COLUMN     "numberOfRooms" INTEGER;

-- CreateTable
CREATE TABLE "calendar_availabilities" (
    "id" TEXT NOT NULL,
    "hotelRoomId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION,

    CONSTRAINT "calendar_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_wish_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelCardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wish_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelRoomId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendar_availabilities_hotelRoomId_date_key" ON "calendar_availabilities"("hotelRoomId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_wish_lists_userId_hotelCardId_key" ON "user_wish_lists"("userId", "hotelCardId");

-- AddForeignKey
ALTER TABLE "calendar_availabilities" ADD CONSTRAINT "calendar_availabilities_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wish_lists" ADD CONSTRAINT "user_wish_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wish_lists" ADD CONSTRAINT "user_wish_lists_hotelCardId_fkey" FOREIGN KEY ("hotelCardId") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_hotelRoomId_fkey" FOREIGN KEY ("hotelRoomId") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
