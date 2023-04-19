/*
  Warnings:

  - Added the required column `displayTitle` to the `TodoItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TodoItem` ADD COLUMN `displayTitle` VARCHAR(255) NOT NULL;
