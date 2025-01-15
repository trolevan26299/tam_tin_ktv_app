import { NextResponse } from 'next/server'
import LinhKien from '@/lib/models/LinhKien'
import connect from "@/utils/db";

export async function GET() {
  console.log("có đến đây không")
  await connect()
  try {
    const linhKien = await LinhKien.find({})
    return NextResponse.json(linhKien)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}