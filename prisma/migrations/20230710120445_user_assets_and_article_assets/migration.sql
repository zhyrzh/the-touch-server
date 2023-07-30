-- AlterTable
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("email");

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleAssets" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "articleId" INTEGER,

    CONSTRAINT "ArticleAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssets" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userProfileEmail" TEXT NOT NULL,

    CONSTRAINT "UserAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_author_relation" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_graphics-artist_relation" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_photo-journalist_relation" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAssets_userProfileEmail_key" ON "UserAssets"("userProfileEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_author_relation_AB_unique" ON "_author_relation"("A", "B");

-- CreateIndex
CREATE INDEX "_author_relation_B_index" ON "_author_relation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_graphics-artist_relation_AB_unique" ON "_graphics-artist_relation"("A", "B");

-- CreateIndex
CREATE INDEX "_graphics-artist_relation_B_index" ON "_graphics-artist_relation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_photo-journalist_relation_AB_unique" ON "_photo-journalist_relation"("A", "B");

-- CreateIndex
CREATE INDEX "_photo-journalist_relation_B_index" ON "_photo-journalist_relation"("B");

-- AddForeignKey
ALTER TABLE "ArticleAssets" ADD CONSTRAINT "ArticleAssets_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssets" ADD CONSTRAINT "UserAssets_userProfileEmail_fkey" FOREIGN KEY ("userProfileEmail") REFERENCES "UserProfile"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_author_relation" ADD CONSTRAINT "_author_relation_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_author_relation" ADD CONSTRAINT "_author_relation_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_graphics-artist_relation" ADD CONSTRAINT "_graphics-artist_relation_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_graphics-artist_relation" ADD CONSTRAINT "_graphics-artist_relation_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_photo-journalist_relation" ADD CONSTRAINT "_photo-journalist_relation_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_photo-journalist_relation" ADD CONSTRAINT "_photo-journalist_relation_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("email") ON DELETE CASCADE ON UPDATE CASCADE;
