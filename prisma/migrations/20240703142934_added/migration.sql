/*
  Warnings:

  - You are about to drop the column `movement` on the `MovementLog` table. All the data in the column will be lost.
  - Added the required column `movement_type` to the `MovementLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `MovementLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovementLog" DROP COLUMN "movement",
ADD COLUMN     "movement_type" "MovementType" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
