-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipoLog" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "mensaje" TEXT,
    "insertedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
