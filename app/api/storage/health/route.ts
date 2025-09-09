import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!adminStorage) {
      return NextResponse.json({ ok: false, error: 'adminStorage not initialized' }, { status: 500 });
    }
    const bucket = adminStorage.bucket();
    const bucketName = bucket.name;

    // Attempt a lightweight list to force existence check
    await bucket.getFiles({ maxResults: 1 });

    return NextResponse.json({ ok: true, bucket: bucketName });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || 'Unknown error',
      code: error?.code,
    }, { status: 500 });
  }
}
