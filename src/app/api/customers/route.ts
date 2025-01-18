import { NextResponse } from 'next/server'
import Customer from '@/lib/models/Customer'
import connect from "@/utils/db";

export async function GET() {
  try {
    await connect()
    const customer = await Customer.find({})
    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}