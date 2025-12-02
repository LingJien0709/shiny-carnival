import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users for leaderboard demo
  const users = [
    { displayName: 'Wai Lok', discordHandle: 'wailok#1234', totalRmSaved: 72 },
    { displayName: 'Afiq', discordHandle: 'afiq#5678', totalRmSaved: 45 },
    { displayName: 'Mei', discordHandle: 'mei#9012', totalRmSaved: 21 },
  ];

  for (const userData of users) {
    const existing = await prisma.user.findFirst({
      where: { displayName: userData.displayName }
    });
    
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: userData
      });
    } else {
      await prisma.user.create({
        data: userData
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

