/*
  Warnings:

  - You are about to drop the column `value` on the `message` table. All the data in the column will be lost.
  - Added the required column `content` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "value",
ADD COLUMN     "content" TEXT NOT NULL;
