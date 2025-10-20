-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('EXAM', 'ASSIGNMENT');

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "type" "ResultType" NOT NULL DEFAULT 'EXAM';
