/*
  Warnings:

  - Added the required column `roomId` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_room";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_user";

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "roomId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_room" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
