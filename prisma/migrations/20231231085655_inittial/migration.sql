-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT,
    "resume" TEXT,
    "description" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "jobtitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "year" DATE NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Porfolio" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT,
    "title" TEXT,
    "media" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "year" TEXT,
    "webTechs" TEXT[],
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Porfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebTech" (
    "id" SERIAL NOT NULL,
    "framework" TEXT NOT NULL,

    CONSTRAINT "WebTech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoPortfolio" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT,
    "videoId" TEXT,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
