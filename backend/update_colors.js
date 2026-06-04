const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.story.update({
    where: { id: 48 },
    data: { color: '#ECFDF5', badgeColor: '#10B981' }
  });
  
  await prisma.story.update({
    where: { id: 49 },
    data: { color: '#EFF6FF', badgeColor: '#3B82F6' }
  });
  
  await prisma.story.update({
    where: { id: 50 },
    data: { color: '#F5F3FF', badgeColor: '#8B5CF6' }
  });
  
  await prisma.story.update({
    where: { id: 51 },
    data: { color: '#FFF1F2', badgeColor: '#F43F5E' }
  });

  console.log("Updated colors successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
