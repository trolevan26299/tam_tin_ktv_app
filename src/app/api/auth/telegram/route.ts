import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/lib/models/User';
import { SessionModel } from '@/lib/models/Session';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { telegramUserId } = await req.json();
    
    const user = await UserModel.findOne({
      user_id_telegram: telegramUserId.toString(),
      status: "active"
    });

    if (!user) {
      return NextResponse.json({ 
        authorized: false,
        message: 'Không có quyền truy cập'
      }, { status: 403 });
    }

    // Xóa các session cũ của user này
    await SessionModel.deleteMany({
      userId: user._id
    });

    const authToken = crypto.randomBytes(32).toString('hex');
    
    // Tạo session mới với thời hạn 24 giờ
    await SessionModel.create({
      token: authToken,
      userId: user._id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 giờ
    });

    return NextResponse.json({
      authorized: true,
      authToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username_telegram,
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}