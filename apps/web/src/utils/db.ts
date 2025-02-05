import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

global.prisma = global.prisma || new PrismaClient()

export const prisma = global.prisma

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

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
