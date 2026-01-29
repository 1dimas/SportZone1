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

    // Fetch products with related data
    const produks = await prisma.produk.findMany({
      include: {
        subkategori: {
          include: {
            kategoriOlahraga: true,
          },
        },
        brand: true,
        varian: true, // Include variants to calculate total stock
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Produk');

    // Define columns
    worksheet.columns = [
      { header: 'Nama Produk', key: 'nama', width: 30 },
      { header: 'Kategori', key: 'kategori', width: 20 },
      { header: 'Brand', key: 'brand', width: 20 },
      { header: 'Harga', key: 'harga', width: 15 },
      { header: 'Stok', key: 'stok', width: 10 },
      { header: 'Nilai Stock', key: 'nilai_stock', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Total Terjual', key: 'total_terjual', width: 15 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    // Add data rows
    for (const produk of produks) {
      // Calculate total stock from variants if available
      const totalStock = produk.varian.reduce((sum, variant) => sum + (variant.stok || 0), 0) || produk.stok || 0;

      // Calculate nilai stock
      const nilaiStock = totalStock * Number(produk.harga || 0);

      // Calculate total sold (we'll use a placeholder function)
      const totalSold = await getTotalSoldByProduct(produk.id);

      worksheet.addRow({
        nama: produk.nama,
        kategori: produk.subkategori?.kategoriOlahraga?.nama || '-',
        brand: produk.brand?.nama || '-',
        harga: Number(produk.harga || 0),
        stok: totalStock,
        nilai_stock: nilaiStock,
        status: produk.status,
        total_terjual: totalSold,
      });
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create response with Excel file
    const filename = `data-produk-${new Date().toISOString().split('T')[0]}.xlsx`;
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

// Helper function to get total sold by product (you'll need to implement this based on your schema)
async function getTotalSoldByProduct(productId: string): Promise<number> {
  try {
    // This is a placeholder - implement your actual logic to calculate total sold
    // For example, querying order_items or similar table:
    // const result = await prisma.orderItem.aggregate({
    //   where: { produk_id: productId },
    //   _sum: { quantity: true }
    // });
    // return result._sum.quantity || 0;

    // For now, returning 0 as a placeholder - you'll need to implement this properly
    return 0;
  } catch (error) {
    console.error(`Error getting total sold for product ${productId}:`, error);
    return 0;
  }
}