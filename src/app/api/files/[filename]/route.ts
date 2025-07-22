import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
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

    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Get MIME type
    const mimeType = lookup(filename) || 'application/octet-stream';
    
    // Create response with appropriate headers
    const response = new NextResponse(new Uint8Array(fileBuffer));
    response.headers.set('Content-Type', mimeType);
    response.headers.set('Content-Disposition', `inline; filename="${filename}"`);
    
    return response;

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { message: 'Error reading file' },
      { status: 500 }
    );
  }
}
