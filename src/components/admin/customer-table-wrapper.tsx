"use client"

import { useEffect, useState } from "react"
import { CustomerTable } from "@/components/admin/customer-table"
import { getAllCustomers } from "@/components/lib/services/customer.service"
import { toast } from "sonner"

export function CustomerTableWrapper() {
  const [customerData, setCustomerData] = useState<any[]>([])

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers()
      setCustomerData(data)
    } catch (err) {
      console.error("Failed to fetch customers:", err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to load customer data: ${errorMessage}`)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return <CustomerTable data={customerData} onRefresh={fetchCustomers} />
}
