import { PostProvider } from '@/context/PostContext';
import { CommentProvider } from '@/context/CommentContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { Toaster } from '@/components/ui/sonner';
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostProvider>
          <CommentProvider>
            <CategoryProvider>
              {children}
            </CategoryProvider>
          </CommentProvider>
        </PostProvider>
        <Toaster />
      </body>
    </html>
  );
}

