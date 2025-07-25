import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Check if uploads directory exists
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        files: [],
        message: 'No uploads directory found'
      });
    }

    // Read directory contents
    const files = await readdir(uploadsDir);
    
    // Get file stats for each file
    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        const filePath = join(uploadsDir, fileName);
        const stats = await stat(filePath);
        
        // Extract original filename from date-based naming convention
        // Format: YYYY-MM-DD_HH-MM-SS_timestamp_originalname.ext
        const parts = fileName.split('_');
        let originalName = fileName; // fallback to full filename
        
        if (parts.length >= 4) {
          // Remove date, time, and timestamp parts, keep the rest
          originalName = parts.slice(3).join('_');
        } else {
          // Fallback for old timestamp format: timestamp_originalname.ext
          originalName = parts.slice(1).join('_') || fileName;
        }
        
        return {
          name: fileName,
          originalName: originalName,
          size: stats.size,
          uploadDate: stats.birthtime,
          modifiedDate: stats.mtime,
        };
      })
    );

    // Sort by upload date (newest first)
    fileDetails.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

    return NextResponse.json({
      files: fileDetails,
      count: fileDetails.length
    });

  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { message: 'Error retrieving file list', files: [] },
      { status: 500 }
    );
  }
}
