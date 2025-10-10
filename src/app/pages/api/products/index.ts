import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProduk } from "@/components/lib/services/produk.service"; // asumsi service ada di sini

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const products = await getAllProduk(); // ambil dari service
      return res.status(200).json(products);
    } catch (error) {
      console.error("API error:", error);
      return res.status(500).json({ message: "Error fetching products" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
