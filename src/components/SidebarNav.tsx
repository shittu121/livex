
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type NavItem = {
  name: string;
  icon: LucideIcon;
  path: string;
};

type SidebarNavProps = {
  items: NavItem[];
  className?: string;
};

export const SidebarNav: React.FC<SidebarNavProps> = ({ items, className = '' }) => {
  const pathname = usePathname();

  return (
    <nav className={`space-y-1 mt-6 ${className}`}>
      {items.map((item) => (
        <motion.div key={item.path} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
          <Link
            href={item.path}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
              pathname === item.path
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};
