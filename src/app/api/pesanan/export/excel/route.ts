import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

interface AuthResult {
  valid: boolean;
  error?: string;
  status?: number;
  user?: any;
}

// Authentication helper function
async function verifyAuth(request: NextRequest, requiredRoles: string[]): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        valid: false,
        error: 'Authorization header missing or invalid',
        status: 401
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Validate the token by calling the backend API
    // This assumes your backend has an endpoint to validate tokens
    try {
      const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${BACKEND_API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          valid: false,
          error: 'Invalid or expired token',
          status: 401
        };
      }

      const userData = await response.json();
      
      // Check if user has required role
      const userRole = userData.role?.name || userData.role || userData.userRole;
      if (!requiredRoles.includes(userRole)) {
        return {
          valid: false,
          error: 'Insufficient permissions',
          status: 403
        };
      }

      return {
        valid: true,
        user: userData
      };
    } catch (validationError) {
      console.error('Token validation error:', validationError);
      return {
        valid: false,
        error: 'Token validation failed',
        status: 401
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      valid: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request, ['admin']);
    if (!authResult.valid) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Fetch orders with related data
    const orders = await prisma.pesanan.findMany({
      include: {
        user: true,
        pesanan_items: true,
        pembayaran: true,
      },
      orderBy: {
        tanggal_pesanan: 'desc',
      },
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Pesanan');

    // Define columns
    worksheet.columns = [
      { header: 'ID Pesanan', key: 'id', width: 38 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Tanggal', key: 'tanggal', width: 20 },
      { header: 'Kota/Provinsi', key: 'lokasi', width: 30 },
      { header: 'Total Harga', key: 'total_harga', width: 15 },
      { header: 'Status Pesanan', key: 'status_pesanan', width: 15 },
      { header: 'Jumlah Item', key: 'jumlah_item', width: 15 },
      { header: 'Metode Pembayaran', key: 'metode_pembayaran', width: 20 },
      { header: 'Status Pembayaran', key: 'status_pembayaran', width: 20 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    // Add data rows
    orders.forEach((order) => {
      worksheet.addRow({
        id: order.id,
        username: order.user?.username || '-',
        email: order.user?.email || '-',
        tanggal: order.tanggal_pesanan
          ? new Date(order.tanggal_pesanan).toLocaleString('id-ID')
          : '-',
        lokasi: `${order.kota || '-'}/${order.provinsi || '-'}`,
        total_harga: Number(order.total_harga),
        status_pesanan: order.status,
        jumlah_item: order.pesanan_items?.length || 0,
        metode_pembayaran: order.pembayaran?.metode || '-',
        status_pembayaran: order.pembayaran?.status || '-',
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create response with Excel file
    const filename = `data-pesanan-${new Date().toISOString().split('T')[0]}.xlsx`;
    const response = new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}