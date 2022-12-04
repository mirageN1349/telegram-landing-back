/*
  Warnings:

  - Changed the type of `key` on the `role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "role_key" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "role" DROP COLUMN "key",
ADD COLUMN     "key" "role_key" NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "role_key_key" ON "role"("key");
