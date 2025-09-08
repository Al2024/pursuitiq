import { NextRequest, NextResponse } from 'next/server';
import { firebaseStorage } from '@/lib/firebaseStorageService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const fileId = context.params.id;
    const buffer = await firebaseStorage.getFileBuffer(fileId);
    if (!buffer) return NextResponse.json({ error: 'File not found' }, { status: 404 });
    const meta = await firebaseStorage.getFileMetadata(fileId);
    if (!meta) return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': meta.mimeType,
        'Content-Disposition': `attachment; filename="${meta.originalName}"`,
        'Content-Length': String(meta.size),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
