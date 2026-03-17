import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-600">/</span>}
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="hover:text-[#14f195] transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? 'text-white' : ''}>
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
