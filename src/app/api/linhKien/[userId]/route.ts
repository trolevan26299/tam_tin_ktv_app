import LinhKienModel from "@/lib/models/LinhKien";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { userId: string } }) {
  await connect();
  try {
    const linhKiens = await LinhKienModel.find({
      data_ung: {
        $elemMatch: {
          id: route.params.userId,
          total: { $ne: 0 },
        },
      },
    });
    return NextResponse.json(linhKiens);
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
