/*
  Warnings:

  - Added the required column `name` to the `hotel_parking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hotel_parking" ADD COLUMN     "name" TEXT NOT NULL;
