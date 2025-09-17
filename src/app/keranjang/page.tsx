'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { dummyProduct } from '@/app/data/dummyProduct';

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const initialItems: CartItem[] = [
  { id: 1, name: dummyProduct.name, price: dummyProduct.price, image: dummyProduct.images[0] ?? '/products/kao.jpeg', quantity: 1 },
  { id: 2, name: 'Adidas Ultraboost 22', price: 2200000, image: dummyProduct.images[1] ?? '/products/kao.jpeg', quantity: 2 },
  { id: 3, name: 'Puma RS-X', price: 1200000, image: dummyProduct.images[2] ?? '/products/kao.jpeg', quantity: 1 },
];

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

export default function KeranjangPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );

  // Aturan promo sederhana
  const discountPercent = useMemo(() => {
    if (appliedCode === 'SPORT10') return 10;
    if (appliedCode === 'RUN15') return 15;
    return 0;
  }, [appliedCode]);

  const discount = Math.floor((subtotal * discountPercent) / 100);
  const shipping = subtotal > 1000000 ? 0 : (items.length > 0 ? 15000 : 0);
  const total = Math.max(subtotal - discount, 0) + shipping;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (['SPORT10', 'RUN15'].includes(code)) {
      setAppliedCode(code);
    } else {
      setAppliedCode(null);
    }
  };

  const increment = (id: number) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
    );
  };

  const decrement = (id: number) => {
    setItems(prev =>
      prev.map(it =>
        it.id === id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              {items.length === 0 ? (
                <p className="text-sm text-gray-600">Keranjang Anda kosong.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="w-32 text-center">Jumlah</TableHead>
                      <TableHead className="w-32 text-right">Harga</TableHead>
                      <TableHead className="w-40 text-right">Subtotal</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Peralatan Olahraga</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => decrement(item.id)}>-</Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => increment(item.id)}>+</Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{rupiah(item.price)}</TableCell>
                        <TableCell className="text-right">{rupiah(item.price * item.quantity)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Belanja</h2>

              {/* Promo code */}
              <div className="mb-4">
                <label className="text-sm text-gray-700 mb-2 block">Kode Promo</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan kode (cth: SPORT10)"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                  />
                  <Button onClick={applyPromo}>Pakai</Button>
                </div>
                {appliedCode ? (
                  <p className="text-xs text-green-600 mt-2">Kode diterapkan: {appliedCode} (-{discountPercent}%)</p>
                ) : promoCode ? (
                  <p className="text-xs text-gray-500 mt-2">Gunakan kode: SPORT10 (10%) atau RUN15 (15%)</p>
                ) : null}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{rupiah(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Diskon</span>
                  <span className="font-medium text-red-600">- {rupiah(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-medium">{shipping === 0 ? 'Gratis' : rupiah(shipping)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{rupiah(total)}</span>
              </div>

              <Button className="w-full mt-6">Checkout</Button>
              <p className="text-xs text-gray-500 mt-2">Gratis ongkir untuk pesanan di atas Rp 1.000.000</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
