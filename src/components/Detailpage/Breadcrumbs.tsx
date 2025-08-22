// components/Breadcrumbs.tsx
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

type BreadcrumbItem = {
  name: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="border-t border-gray-200">
      <nav aria-label="Breadcrumb" className="container mx-auto h-14">
        <ol className="flex items-center h-full space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.name} className="flex items-center">
              <Link
                href={item.href}
                className="font-semibold text-gray-500 hover:text-blue-600"
              >
                {item.name}
              </Link>
              {/* Tampilkan pemisah jika bukan item terakhir */}
              {index < items.length - 1 && (
                <FiChevronRight className="ml-2 h-5 w-5 text-gray-400" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};