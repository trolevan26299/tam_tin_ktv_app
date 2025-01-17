import DeviceModel from "@/lib/models/Device";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {
  await connect();
  console.log("route.params.id:",route.params.id)
  try {
    const device = await DeviceModel.findOne({ id_device: route.params.id });
    if (!device) {
      return NextResponse.json(
        { error: 'Không tìm thấy thiết bị' },
        { status: 404 }
      );
    }
    console.log("device", device);
    return NextResponse.json(device);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
