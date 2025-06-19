/*
  Warnings:

  - You are about to drop the column `reelId` on the `ReelsLog` table. All the data in the column will be lost.
  - Added the required column `reelName` to the `ReelsLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReelsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reelName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mensaje" TEXT,
    "insertedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReelsLog_reelName_fkey" FOREIGN KEY ("reelName") REFERENCES "Reels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReelsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReelsLog" ("id", "insertedAt", "mensaje", "status", "userId") SELECT "id", "insertedAt", "mensaje", "status", "userId" FROM "ReelsLog";
DROP TABLE "ReelsLog";
ALTER TABLE "new_ReelsLog" RENAME TO "ReelsLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
