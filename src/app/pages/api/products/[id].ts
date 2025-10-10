import type { NextApiRequest, NextApiResponse } from "next";
import { getProdukById } from "@/components/lib/services/produk.service"; // pakai service kamu

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const product = await getProdukById(id as string);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.error("API error:", error);
      return res.status(500).json({ message: "Error fetching product" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
