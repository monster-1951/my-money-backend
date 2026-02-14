/*
  Warnings:

  - Added the required column `icon` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "icon" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "fk_account_icons" FOREIGN KEY ("icon") REFERENCES "icons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
