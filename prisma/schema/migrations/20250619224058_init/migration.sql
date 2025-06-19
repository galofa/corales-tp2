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
    CONSTRAINT "ReelsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReelsLog" ("id", "insertedAt", "mensaje", "reelName", "status", "userId") SELECT "id", "insertedAt", "mensaje", "reelName", "status", "userId" FROM "ReelsLog";
DROP TABLE "ReelsLog";
ALTER TABLE "new_ReelsLog" RENAME TO "ReelsLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
