-- CreateEnum
CREATE TYPE "TipSegment" AS ENUM ('FREE', 'VIP');

-- CreateEnum
CREATE TYPE "TipStatus" AS ENUM ('ACTIVE', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "segment" "TipSegment" NOT NULL,
    "home" TEXT NOT NULL,
    "away" TEXT NOT NULL,
    "homeLogo" TEXT NOT NULL,
    "awayLogo" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "odds" TEXT NOT NULL,
    "prob" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "summary" TEXT,
    "winProb" JSONB,
    "stats" JSONB,
    "form" JSONB,
    "h2h" JSONB,
    "status" "TipStatus" NOT NULL DEFAULT 'ACTIVE',
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAccess" (
    "deviceId" TEXT NOT NULL,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceAccess_pkey" PRIMARY KEY ("deviceId")
);
