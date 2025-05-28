-- CreateTable
CREATE TABLE "Reels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caption" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Reels_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
