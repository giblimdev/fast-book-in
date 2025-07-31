/*
  Warnings:

  - You are about to drop the column `promoMessage` on the `hotelCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."addresses" ALTER COLUMN "streetName" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."hotelCard" DROP COLUMN "promoMessage";
