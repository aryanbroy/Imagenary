import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error fetching videos' })
  } finally {
    await prisma.$disconnect()
  }
}
