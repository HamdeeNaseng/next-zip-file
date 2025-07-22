import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { lookup } from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename) {
      return NextResponse.json(
        { message: 'Filename is required' },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadsDir, filename);

    // Security check: ensure the file path is within uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { message: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { message: 'File not found' },
        { status: 404 }
      );
    }

    // Get file stats
    const fileStats = await stat(filePath);
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Get MIME type
    const mimeType = lookup(filename) || 'application/octet-stream';
    
    // Use the date-based filename for download (not the original name)
    // This ensures users get files with the organized date-based naming
    
    // Create response with download headers
    const response = new NextResponse(new Uint8Array(fileBuffer));
    response.headers.set('Content-Type', mimeType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    response.headers.set('Content-Length', fileStats.size.toString());
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { message: 'Error downloading file' },
      { status: 500 }
    );
  }
}
