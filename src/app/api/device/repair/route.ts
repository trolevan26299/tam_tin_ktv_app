import { NextResponse } from 'next/server'
import Device from '@/lib/models/Device'
import connect from "@/utils/db";
import LinhKien from '@/lib/models/LinhKien';

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
      staff_repair: `${data.staff_repair.name}`, 
      note: data.note
    })
   // Cập nhật số lượng linh kiện
   for (const linhKienItem of data.linh_kien) {
    const linhKien = await LinhKien.findOne({ name_linh_kien: linhKienItem.name })
    if (!linhKien) {
        continue
    }

    // Đảm bảo quantity là số
    const quantity = Number(linhKienItem.total) || 0

    // Tìm xem user đã có trong data_ung chưa
    const existingDataUng = linhKien.data_ung.find(
        (item:any) => item.id === data.staff_repair.id
    )

    if (existingDataUng) {
        // Nếu đã có thì cập nhật total
        existingDataUng.total = Number(existingDataUng.total || 0) - quantity
    } else {
        // Nếu chưa có thì thêm mới
        linhKien.data_ung.push({
            name: data.staff_repair.name,
            id: data.staff_repair.id,
            total: -quantity
        })
    }

    // Trừ tổng số lượng linh kiện
    // linhKien.total = Number(linhKien.total || 0) - quantity không trừ tổng chỉ trừ ứng
    await linhKien.save()
}

await device.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("error:",error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}