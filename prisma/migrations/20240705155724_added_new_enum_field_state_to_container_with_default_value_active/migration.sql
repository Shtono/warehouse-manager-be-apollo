-- CreateEnum
CREATE TYPE "ContainerState" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "state" "ContainerState" NOT NULL DEFAULT 'ACTIVE';
