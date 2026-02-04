import { prisma } from '../lib/prisma'

(BigInt.prototype as any).toJSON = function () {
return (Number(this));
};

export async function getAllRecords() {
  const allRecords = await prisma.records.findMany()
  return JSON.stringify(allRecords)
}
