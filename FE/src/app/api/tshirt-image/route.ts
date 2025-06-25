import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Đường dẫn đến file ảnh
    const imagePath = path.join(process.cwd(), 'src', 'app', 'design', 'tshirt', '[id]', 'Screenshot_2025-06-24_082816-removebg-preview.png');
    
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Đọc file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Trả về ảnh với header phù hợp
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
