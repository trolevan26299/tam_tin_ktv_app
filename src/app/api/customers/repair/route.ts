import { NextResponse } from 'next/server'
import Customer from '@/lib/models/Customer'
import LinhKien from '@/lib/models/LinhKien'
import connect from "@/utils/db"

export async function POST(request: Request) {
  try {
    await connect()
    const data = await request.json()

    // Validate dữ liệu đầu vào
    if (!data.customer_id || !data.type_repair || !data.linh_kien) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Tìm khách hàng
    const customer = await Customer.findById(data.customer_id)
    if (!customer) {
      return NextResponse.json(
        { error: 'Không tìm thấy khách hàng' },
        { status: 404 }
      )
    }

    // Thêm lịch sử sửa chữa
    customer.history_repair.push({
      type_repair: data.type_repair,
      date_repair: data.date_repair,
      linh_kien: data.linh_kien,
      staff_repair: `${data.staff_repair.name}`,
      note: data.note
    })

    // Cập nhật số lượng linh kiện và data_ung
    for (const linhKienItem of data.linh_kien) {
      const linhKien = await LinhKien.findOne({ name_linh_kien: linhKienItem.name })
      if (!linhKien) {
        continue
      }

      // Đảm bảo quantity là số
      const quantity = Number(linhKienItem.total) || 0

      // Tìm xem user đã có trong data_ung chưa
      const existingDataUng = linhKien.data_ung.find(
        (item: any) => item.id === data.staff_repair.id
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
      // linhKien.total = Number(linhKien.total || 0) - quantity bỏ trừ tổng chỉ trừ ứng
      await linhKien.save()
    }

    await customer.save()
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Lỗi khi cập nhật sửa chữa:", error)
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    )
  }
}