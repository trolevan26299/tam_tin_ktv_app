import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SessionModel } from '@/lib/models/Session';
import { UserModel } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {

  console.log("có vào đây", request);                   
  const authToken = request.headers.get('Authorization')?.replace('Bearer ', '');

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

    const user = await UserModel.findOne({
      _id: new ObjectId(session.userId),
      status: "active"
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ userId: session.userId.toString() });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}