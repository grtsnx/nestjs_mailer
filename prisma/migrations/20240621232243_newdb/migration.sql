-- CreateTable
CREATE TABLE "User" (
    "userid" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Otp" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_address_key" ON "User"("email_address");
