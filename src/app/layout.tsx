import type { Metadata } from 'next';
import Navigation from './components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediSync - Patient Management',
  description: 'Healthcare patient management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <main className="bg-white rounded-lg shadow-lg p-6 mb-8">
            {children}
          </main>

          <footer className="text-center text-gray-600 text-sm mt-8">
            <p>Backend API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</p>
            <p className="mt-2">© 2025 MediSync - Healthcare Patient Management built by Kush</p>
          </footer>
        </div>
      </body>
    </html>
  );
}