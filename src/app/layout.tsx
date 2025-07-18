import { PostProvider } from '@/context/PostContext';
import { Toaster } from '@/components/ui/sonner';
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostProvider>{children}</PostProvider>
        <Toaster />
      </body>
    </html>
  );
}

