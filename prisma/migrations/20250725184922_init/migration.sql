-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'guest',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "code" TEXT NOT NULL,
    "language" TEXT,
    "currency" TEXT DEFAULT '€',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighborhoods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landmarks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "popularityScore" INTEGER NOT NULL DEFAULT 0,
    "cityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "radius" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hotelDetailsId" TEXT,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "description" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_highlights" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_amenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "category" TEXT,
    "icon" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomAmenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessibility_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessibility_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_parking" (
    "id" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "spaces" INTEGER,
    "order" INTEGER DEFAULT 100,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "streetNumber" TEXT,
    "streetName" TEXT NOT NULL,
    "addressLine2" TEXT,
    "postalCode" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "neighborhoodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_images" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageType" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 20,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idCity" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 20,
    "shortDescription" TEXT,
    "starRating" INTEGER NOT NULL,
    "overallRating" DOUBLE PRECISION,
    "ratingAdjective" TEXT,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "basePricePerNight" DOUBLE PRECISION NOT NULL,
    "regularPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "promoMessage" TEXT,
    "imageMessage" TEXT,
    "cancellationPolicy" TEXT,
    "accommodationTypeId" TEXT,
    "destinationId" TEXT,
    "hotelGroupId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "detailsId" TEXT,

    CONSTRAINT "HotelCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_details" (
    "id" TEXT NOT NULL,
    "idHotelCard" TEXT NOT NULL,
    "description" TEXT,
    "addressId" TEXT NOT NULL,
    "order" INTEGER DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_card_to_highlights" (
    "hotel_card_id" TEXT NOT NULL,
    "hotel_highlight_id" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_card_to_highlights_pkey" PRIMARY KEY ("hotel_card_id","hotel_highlight_id")
);

-- CreateTable
CREATE TABLE "hotel_card_to_labels" (
    "hotel_card_id" TEXT NOT NULL,
    "label_id" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_card_to_labels_pkey" PRIMARY KEY ("hotel_card_id","label_id")
);

-- CreateTable
CREATE TABLE "hotel_card_to_accessibility" (
    "hotel_card_id" TEXT NOT NULL,
    "accessibility_option_id" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_card_to_accessibility_pkey" PRIMARY KEY ("hotel_card_id","accessibility_option_id")
);

-- CreateTable
CREATE TABLE "hotel_card_to_amenities" (
    "hotel_card_id" TEXT NOT NULL,
    "hotel_amenity_id" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_card_to_amenities_pkey" PRIMARY KEY ("hotel_card_id","hotel_amenity_id")
);

-- CreateTable
CREATE TABLE "hotel_details_to_room_amenities" (
    "hotel_details_id" TEXT NOT NULL,
    "room_amenity_id" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_details_to_room_amenities_pkey" PRIMARY KEY ("hotel_details_id","room_amenity_id")
);

-- CreateTable
CREATE TABLE "destination_to_cities" (
    "destination_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "order" INTEGER DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_to_cities_pkey" PRIMARY KEY ("destination_id","city_id")
);

-- CreateTable
CREATE TABLE "_CityToDestination" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CityToDestination_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HotelAmenityToHotelCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HotelAmenityToHotelCard_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AddressToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AddressToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HotelCardToHotelParking" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HotelCardToHotelParking_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HotelCardToHotelImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HotelCardToHotelImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HotelDetailsToRoomAmenity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HotelDetailsToRoomAmenity_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "accommodation_types_code_key" ON "accommodation_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "labels_code_key" ON "labels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "accessibility_options_code_key" ON "accessibility_options"("code");

-- CreateIndex
CREATE INDEX "_CityToDestination_B_index" ON "_CityToDestination"("B");

-- CreateIndex
CREATE INDEX "_HotelAmenityToHotelCard_B_index" ON "_HotelAmenityToHotelCard"("B");

-- CreateIndex
CREATE INDEX "_AddressToUser_B_index" ON "_AddressToUser"("B");

-- CreateIndex
CREATE INDEX "_HotelCardToHotelParking_B_index" ON "_HotelCardToHotelParking"("B");

-- CreateIndex
CREATE INDEX "_HotelCardToHotelImage_B_index" ON "_HotelCardToHotelImage"("B");

-- CreateIndex
CREATE INDEX "_HotelDetailsToRoomAmenity_B_index" ON "_HotelDetailsToRoomAmenity"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landmarks" ADD CONSTRAINT "landmarks_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_hotelDetailsId_fkey" FOREIGN KEY ("hotelDetailsId") REFERENCES "hotel_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelCard" ADD CONSTRAINT "HotelCard_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "hotel_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelCard" ADD CONSTRAINT "HotelCard_accommodationTypeId_fkey" FOREIGN KEY ("accommodationTypeId") REFERENCES "accommodation_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelCard" ADD CONSTRAINT "HotelCard_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelCard" ADD CONSTRAINT "HotelCard_hotelGroupId_fkey" FOREIGN KEY ("hotelGroupId") REFERENCES "hotel_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_details" ADD CONSTRAINT "hotel_details_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_highlights" ADD CONSTRAINT "hotel_card_to_highlights_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "HotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_highlights" ADD CONSTRAINT "hotel_card_to_highlights_hotel_highlight_id_fkey" FOREIGN KEY ("hotel_highlight_id") REFERENCES "hotel_highlights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_labels" ADD CONSTRAINT "hotel_card_to_labels_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "HotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_labels" ADD CONSTRAINT "hotel_card_to_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_accessibility" ADD CONSTRAINT "hotel_card_to_accessibility_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "HotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_accessibility" ADD CONSTRAINT "hotel_card_to_accessibility_accessibility_option_id_fkey" FOREIGN KEY ("accessibility_option_id") REFERENCES "accessibility_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_amenities" ADD CONSTRAINT "hotel_card_to_amenities_hotel_card_id_fkey" FOREIGN KEY ("hotel_card_id") REFERENCES "HotelCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_card_to_amenities" ADD CONSTRAINT "hotel_card_to_amenities_hotel_amenity_id_fkey" FOREIGN KEY ("hotel_amenity_id") REFERENCES "hotel_amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_details_to_room_amenities" ADD CONSTRAINT "hotel_details_to_room_amenities_hotel_details_id_fkey" FOREIGN KEY ("hotel_details_id") REFERENCES "hotel_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_details_to_room_amenities" ADD CONSTRAINT "hotel_details_to_room_amenities_room_amenity_id_fkey" FOREIGN KEY ("room_amenity_id") REFERENCES "RoomAmenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_to_cities" ADD CONSTRAINT "destination_to_cities_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_to_cities" ADD CONSTRAINT "destination_to_cities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CityToDestination" ADD CONSTRAINT "_CityToDestination_A_fkey" FOREIGN KEY ("A") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CityToDestination" ADD CONSTRAINT "_CityToDestination_B_fkey" FOREIGN KEY ("B") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelAmenityToHotelCard" ADD CONSTRAINT "_HotelAmenityToHotelCard_A_fkey" FOREIGN KEY ("A") REFERENCES "hotel_amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelAmenityToHotelCard" ADD CONSTRAINT "_HotelAmenityToHotelCard_B_fkey" FOREIGN KEY ("B") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToUser" ADD CONSTRAINT "_AddressToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToUser" ADD CONSTRAINT "_AddressToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelCardToHotelParking" ADD CONSTRAINT "_HotelCardToHotelParking_A_fkey" FOREIGN KEY ("A") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelCardToHotelParking" ADD CONSTRAINT "_HotelCardToHotelParking_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_parking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelCardToHotelImage" ADD CONSTRAINT "_HotelCardToHotelImage_A_fkey" FOREIGN KEY ("A") REFERENCES "HotelCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelCardToHotelImage" ADD CONSTRAINT "_HotelCardToHotelImage_B_fkey" FOREIGN KEY ("B") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelDetailsToRoomAmenity" ADD CONSTRAINT "_HotelDetailsToRoomAmenity_A_fkey" FOREIGN KEY ("A") REFERENCES "hotel_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelDetailsToRoomAmenity" ADD CONSTRAINT "_HotelDetailsToRoomAmenity_B_fkey" FOREIGN KEY ("B") REFERENCES "RoomAmenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
