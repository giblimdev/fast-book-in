-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_neighborhoodId_fkey";

-- CreateTable
CREATE TABLE "_AddressToLandmark" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AddressToLandmark_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AddressToLandmark_B_index" ON "_AddressToLandmark"("B");

-- AddForeignKey
ALTER TABLE "_AddressToLandmark" ADD CONSTRAINT "_AddressToLandmark_A_fkey" FOREIGN KEY ("A") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToLandmark" ADD CONSTRAINT "_AddressToLandmark_B_fkey" FOREIGN KEY ("B") REFERENCES "landmarks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
