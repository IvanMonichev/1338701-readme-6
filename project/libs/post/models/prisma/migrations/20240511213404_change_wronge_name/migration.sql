/*
  Warnings:

  - You are about to drop the column `repost_by` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "repost_by",
ADD COLUMN     "reposted_by" TEXT[];
