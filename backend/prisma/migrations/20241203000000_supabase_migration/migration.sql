-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "discordHandle" TEXT NOT NULL,
    "discordUserId" TEXT,
    "totalRmSaved" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ParkingSession
CREATE TABLE "ParkingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "lastReparkTime" TIMESTAMP(3) NOT NULL,
    "reminderScheduledFor" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timesReparked" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: User displayName unique
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");

-- CreateIndex: User discordUserId index
CREATE INDEX "User_discordUserId_idx" ON "User"("discordUserId");

-- CreateIndex: ParkingSession userId, date, isActive index
CREATE INDEX "ParkingSession_userId_date_isActive_idx" ON "ParkingSession"("userId", "date", "isActive");

-- CreateIndex: ParkingSession reminderScheduledFor, isActive index
CREATE INDEX "ParkingSession_reminderScheduledFor_isActive_idx" ON "ParkingSession"("reminderScheduledFor", "isActive");

-- CreateIndex: ParkingSession userId, date, isActive unique
CREATE UNIQUE INDEX "ParkingSession_userId_date_isActive_key" ON "ParkingSession"("userId", "date", "isActive");

-- AddForeignKey
ALTER TABLE "ParkingSession" ADD CONSTRAINT "ParkingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;



