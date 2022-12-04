-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "value" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_RoomToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_nickname_key" ON "user"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "role_key_key" ON "role"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomToUser_AB_unique" ON "_RoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomToUser_B_index" ON "_RoomToUser"("B");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_user" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_room" FOREIGN KEY ("id") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToUser" ADD CONSTRAINT "_RoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToUser" ADD CONSTRAINT "_RoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
