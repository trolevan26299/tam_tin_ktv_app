import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';


const uri = process.env.MONGODB_URI as string;
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const authToken = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (!verifyResponse.ok) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }
  
      const { userId } = await verifyResponse.json();
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', userId);
  
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  matcher: '/api/:path*',
};