/*
  Warnings:

  - You are about to drop the column `product_id` on the `MovementLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovementLog" DROP CONSTRAINT "MovementLog_product_id_fkey";

-- AlterTable
ALTER TABLE "MovementLog" DROP COLUMN "product_id",
ADD COLUMN     "container_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "MovementLog" ADD CONSTRAINT "MovementLog_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "Container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
