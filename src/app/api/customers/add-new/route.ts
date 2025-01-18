import { NextResponse } from 'next/server'
import Customer from '@/lib/models/Customer'
import connect from "@/utils/db"


export async function POST(request: Request) {
  try {
    await connect() 
    const body = await request.json()
    
    // Tạo khách hàng mới
    const newCustomer = new Customer({
      name: body.name,
      address: body.address,
      phone: body.phone,
      type: body.type,
      email: body.email,
      note: body.note,
      regDt: body.regDt
    })

    // Lưu vào database
    await newCustomer.save()

    return NextResponse.json(
      { message: 'Thêm khách hàng thành công', customer: newCustomer },
      { status: 201 }
    )

  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error)
    return NextResponse.json(
      { error: 'Lỗi khi thêm khách hàng' },
      { status: 500 }
    )
  }
}