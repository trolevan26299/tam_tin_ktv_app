import { NextResponse } from 'next/server'
import TransactionLinhKien from '@/lib/models/TransactionLinhKien'
import connect from "@/utils/db";

export async function POST(request: Request) {
    try {
        await connect()
        const data = await request.json()
        const transactionLinhKien = await TransactionLinhKien.create(data)
        return NextResponse.json(transactionLinhKien)
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}