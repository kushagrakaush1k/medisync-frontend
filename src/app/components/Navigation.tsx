'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Home Link */}
          <Link
            href="/"
            className="text-3xl font-bold text-white hover:text-blue-100 transition flex items-center gap-2"
          >
            🏥 <span>MediSync</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {pathname !== '/' && (
              <>
                <Link
                  href="/"
                  className="text-white hover:text-blue-100 font-semibold transition"
                >
                  Home
                </Link>
                <Link
                  href="/patients"
                  className="text-white hover:text-blue-100 font-semibold transition"
                >
                  Patients
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}