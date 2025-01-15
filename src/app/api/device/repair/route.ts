import { NextResponse } from 'next/server'
import Device from '@/lib/models/Device'
import connect from "@/utils/db";

export async function POST(request: Request) {
    try {
    await connect() 
    const data = await request.json()
    
    const device = await Device.findOne({ id_device: data.id_device })
    if (!device) {
      return NextResponse.json({ error: 'Không tìm thấy thiết bị' }, { status: 404 })
    }

    device.history_repair.push({
      type_repair: data.type_repair,
      date_repair: data.date_repair,
      linh_kien: data.linh_kien,
      staff_repair: data.staff_repair,
      note: data.note
    })

    await device.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}