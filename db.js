const { PrismaClient } = require('@prisma/client');

// This prevents multiple instances of Prisma Client in development
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;