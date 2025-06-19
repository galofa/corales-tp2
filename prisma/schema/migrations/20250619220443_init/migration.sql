-- CreateTable
CREATE TABLE "ReelsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mensaje" TEXT,
    "insertedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReelsLog_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReelsLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
