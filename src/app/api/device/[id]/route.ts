import DeviceModel from "@/lib/models/Device";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {
  await connect();
  try {
    const device = await DeviceModel.findOne({ id_device: route.params.id });
    return NextResponse.json(device);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
