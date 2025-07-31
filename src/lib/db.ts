import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getClientStats(clientId: string) {
  const messageCount = await prisma.message.count({
    where: { clientId },
  });

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { createdAt: true },
  });

  return {
    messageCount,
    createdAt: client?.createdAt,
  };
}

export async function getConversationContext(clientId: string, limit: number) {
  const messages = await prisma.message.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return messages.reverse();
}

export async function resetClientHistory(clientId: string) {
    return prisma.message.deleteMany({
        where: { clientId },
    });
}

export default prisma;
