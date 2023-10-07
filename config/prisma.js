import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const global =  {
   prisma: PrismaClient | undefined
}


const client = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prisma === client

export default client
