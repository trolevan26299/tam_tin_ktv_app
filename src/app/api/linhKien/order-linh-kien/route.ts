import { NextResponse } from "next/server";
import connect from "@/utils/db";
import OrderLinhKien from "@/lib/models/OrderLinhKien";

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();
    
    const newOrder = new OrderLinhKien(data);
    await newOrder.save();
    
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng linh kiện:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo đơn hàng linh kiện" },
      { status: 500 }
    );
  }
}