/*
  Warnings:

  - Added the required column `reelurl` to the `Reels` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caption" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "reelurl" TEXT NOT NULL,
    CONSTRAINT "Reels_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reels" ("authorId", "caption", "id") SELECT "authorId", "caption", "id" FROM "Reels";
DROP TABLE "Reels";
ALTER TABLE "new_Reels" RENAME TO "Reels";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
