import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

interface RouteParams {
  params: Promise<{
    userId: string;
    timestamp: string;
    file: string;
  }>;
}

function isSafeUserId(value: string): boolean {
  return /^[a-zA-Z0-9-]+$/.test(value);
}

function isSafeTimestamp(value: string): boolean {
  return /^\d+$/.test(value);
}

function isSafeFile(value: string): boolean {
  return /^[a-zA-Z0-9._-]+\.rdf$/i.test(value) && !value.includes('..');
}

function getExportsRoot(): string {
  return 'C:\\xampp\\htdocs\\table-editor\\exports';
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { userId, timestamp, file } = await params;

  if (!isSafeUserId(userId) || !isSafeTimestamp(timestamp) || !isSafeFile(file)) {
    return new Response('Invalid file request', { status: 400 });
  }

  const exportRoot = getExportsRoot();
  const filePath = path.join(exportRoot, userId, timestamp, file);

  try {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      return new Response('Not found', { status: 404 });
    }

    const stream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': `attachment; filename="${file}"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
