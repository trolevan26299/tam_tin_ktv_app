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
    
    const session = await SessionModel.findOne({
      token: authToken,
      expires: { $gt: new Date() }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.log("error",error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}