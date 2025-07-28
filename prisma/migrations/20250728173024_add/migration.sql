/*
  Warnings:

  - You are about to drop the column `entityId` on the `hotel_images` table. All the data in the column will be lost.
  - You are about to drop the column `imageType` on the `hotel_images` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `hotel_images` table. All the data in the column will be lost.
  - You are about to drop the `_GaleryImageToImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageCategories` to the `hotel_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GaleryImageToImage" DROP CONSTRAINT "_GaleryImageToImage_A_fkey";

-- DropForeignKey
ALTER TABLE "_GaleryImageToImage" DROP CONSTRAINT "_GaleryImageToImage_B_fkey";

-- AlterTable
ALTER TABLE "hotel_images" DROP COLUMN "entityId",
DROP COLUMN "imageType",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageCategories" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GaleryImageToImage";

-- CreateTable
CREATE TABLE "_GalleryImageToImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GalleryImageToImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GalleryImageToImage_B_index" ON "_GalleryImageToImage"("B");

-- AddForeignKey
ALTER TABLE "_GalleryImageToImage" ADD CONSTRAINT "_GalleryImageToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GalleryImageToImage" ADD CONSTRAINT "_GalleryImageToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
