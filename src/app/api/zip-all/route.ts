import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { existsSync } from 'fs';
import archiver from 'archiver';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'uploads');
    
    // Check if uploads directory exists
    if (!existsSync(uploadsDir)) {
      return NextResponse.json(
        { message: 'No uploads directory found' },
        { status: 404 }
      );
    }

    // Read all files in the uploads directory
    const files = await readdirAsync(uploadsDir);
    
    if (files.length === 0) {
      return NextResponse.json(
        { message: 'No files to zip' },
        { status: 404 }
      );
    }

    // Create a ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Create a readable stream for the ZIP
    const stream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk) => {
          controller.enqueue(new Uint8Array(chunk));
        });

        archive.on('end', () => {
          controller.close();
        });

        archive.on('error', (err) => {
          console.error('Archive error:', err);
          controller.error(err);
        });

        // Add all files to the ZIP
        Promise.all(
          files.map(async (fileName) => {
            const filePath = join(uploadsDir, fileName);
            const stats = await statAsync(filePath);
            
            if (stats.isFile()) {
              // Add file to archive with its filename
              archive.file(filePath, { name: fileName });
            }
          })
        ).then(() => {
          // Finalize the archive
          archive.finalize();
        }).catch((err) => {
          console.error('Error adding files to archive:', err);
          controller.error(err);
        });
      }
    });

    // Generate filename with current date and file count
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const zipFileName = `all-files_${files.length}-files_${dateStr}_${timeStr}.zip`;

    // Return the ZIP file as a download
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Error creating ZIP:', error);
    return NextResponse.json(
      { message: 'Error creating ZIP file' },
      { status: 500 }
    );
  }
}
