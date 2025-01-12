import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SessionModel } from '@/lib/models/Session';


export async function GET(req: Request) {
  const authToken = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // Tìm session và in ra để debug
    const session = await SessionModel.findOne({
      token: authToken,
    });
    
    if (!session || session.expires <= currentTimestamp) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.log("error",error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}