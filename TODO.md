# TODO: Implement Pesanan Features for Petugas Dashboard

## Step 1: Create API Service for Pesanan ✅
- Create src/components/lib/services/pesanan.service.ts
- Implement methods for:
  - fetchAllPesanan(): GET /pesanan (list all orders)
  - fetchPesananById(id: string): GET /pesanan/:id (get order details)
  - updatePesananStatus(id: string, status: string): PUT /pesanan/:id/status (update status)

## Step 2: Create Pesanan List Page ✅
- Create src/app/dashboardpetugas/pesanan/page.tsx
- Display list of orders in a table format
- Include columns: ID, Customer, Date, Total, Status
- Add click handler to navigate to order details
- Use existing UI components for consistency

## Step 3: Create Pesanan Detail Component ✅
- Create src/components/petugas/pesanan-detail.tsx
- Display order details: items, customer info, shipping address
- Include status update dropdown/button (only for petugas role)
- Handle status update API call
- Show success/error messages

## Step 4: Update Sidebar Menu ✅
- Update src/components/petugas/app-sidebar.tsx
- Change "Pesanan" menu item URL from "#" to "/dashboardpetugas/pesanan"

## Step 5: Test and Verify
- Test order list loading
- Test order detail view
- Test status update functionality
- Verify role-based access control
- Ensure proper error handling

## Step 6: Final Review
- Check code quality and consistency
- Ensure responsive design
- Verify integration with backend API
