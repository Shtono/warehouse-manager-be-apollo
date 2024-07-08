/*
  Warnings:

  - You are about to drop the column `warehouse_cuurent_capacity` on the `MovementLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MovementLog" DROP COLUMN "warehouse_cuurent_capacity",
ADD COLUMN     "warehouse_current_capacity" DOUBLE PRECISION NOT NULL DEFAULT 0;
