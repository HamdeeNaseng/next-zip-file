import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Get file extension and validate
    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    
    // Optional: Add file type restrictions
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip'];
    if (fileExt && !allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { message: `File type .${fileExt} is not allowed. Allowed types: ${allowedExtensions.join(', ')}` },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate date-based filename to prevent conflicts
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const timestamp = Date.now(); // Add milliseconds for uniqueness
    const fileExtension = fileName.split('.').pop();
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    
    const uniqueFileName = `${dateStr}_${timeStr}_${timestamp}_${fileNameWithoutExt}.${fileExtension}`;
    const filePath = join(uploadsDir, uniqueFileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Log upload info (in production, you might want to save to database)
    console.log(`File uploaded: ${uniqueFileName}, Size: ${file.size} bytes`);

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: uniqueFileName,
      originalName: fileName,
      fileSize: file.size,
      uploadPath: `/uploads/${uniqueFileName}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  );
}
