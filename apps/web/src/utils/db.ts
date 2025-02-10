import { PrismaClient } from '@prisma/client' 

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 

export { PrismaClient }

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('Connected to PostgreSQL database')
    return prisma
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('Disconnected from PostgreSQL database')
  } catch (error) {
    console.error('Database disconnection error:', error)
  }
}

export default prisma
