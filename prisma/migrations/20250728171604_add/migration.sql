-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "path" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GaleryImageToImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GaleryImageToImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GaleryImageToImage_B_index" ON "_GaleryImageToImage"("B");

-- AddForeignKey
ALTER TABLE "_GaleryImageToImage" ADD CONSTRAINT "_GaleryImageToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "hotel_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GaleryImageToImage" ADD CONSTRAINT "_GaleryImageToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
