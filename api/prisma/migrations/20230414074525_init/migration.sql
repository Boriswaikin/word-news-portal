/*
  Warnings:

  - Added the required column `publishDate` to the `TodoItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TodoItem` ADD COLUMN `publishDate` VARCHAR(255) NOT NULL;
