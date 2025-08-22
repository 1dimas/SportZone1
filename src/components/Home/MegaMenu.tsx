// components/MegaMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { menuData, MenuItem } from "@/app/data/menuData";

export const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null);

  const handleMouseEnter = (item: MenuItem) => {
    if (item.columns.length > 0) {
      setActiveMenu(item);
    }
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div onMouseLeave={handleMouseLeave} className="relative container mx-auto">
      <div className="flex items-center justify-center gap-8 h-14">
        {menuData.map((item) => (
          <div
            key={item.title}
            onMouseEnter={() => handleMouseEnter(item)}
            className="h-full flex items-center"
          >
            <Link
              href={item.href}
              className="font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>

      {activeMenu && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg p-8 z-20">
          <div className="container mx-auto flex gap-12">
            {activeMenu.columns.map((column) => (
              <div key={column.heading} className="flex-1">
                <h3 className="font-bold text-base text-gray-800 mb-4 border-b-2 border-blue-500 pb-2 uppercase">
                  {column.heading}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
