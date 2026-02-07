/*
  Warnings:

  - You are about to alter the column `balance` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(19,4)`.
  - You are about to alter the column `amount` on the `records` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(19,4)`.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "records" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,4);
