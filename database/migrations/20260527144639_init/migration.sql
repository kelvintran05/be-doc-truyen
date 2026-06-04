-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "audio" BOOLEAN NOT NULL,
    "color" TEXT NOT NULL,
    "badgeColor" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "moral" TEXT NOT NULL,
    "audioDuration" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "pages" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");
