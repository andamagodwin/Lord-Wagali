import { PrismaClient } from '@prisma/client';
import { defaultAccessIds, seedMatches } from '../src/data/seed';

const prisma = new PrismaClient();

async function main() {
  await prisma.match.createMany({ data: seedMatches, skipDuplicates: true });

  await prisma.deviceAccess.createMany({
    data: defaultAccessIds.map(deviceId => ({ deviceId, isVip: true })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
