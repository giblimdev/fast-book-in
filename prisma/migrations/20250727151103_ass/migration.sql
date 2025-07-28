/*
  Warnings:

  - Added the required column `name` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "name" TEXT NOT NULL;
