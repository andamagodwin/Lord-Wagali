import { createApp } from './app';
import { env } from './env';
import { prisma } from './prisma';

async function main() {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

void main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
