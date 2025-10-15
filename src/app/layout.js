import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'MediSync - Enterprise Healthcare Platform',
  description: 'FHIR R4 compliant healthcare platform for patient management and analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          {/* Desktop: Add left padding for sidebar */}
          {/* Mobile: Add top padding for header */}
          <main className="lg:pl-64 pt-16 lg:pt-20">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}