'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePosts } from '@/context/PostContext';
import { useComments } from '@/context/CommentContext';
import { useCategories } from '@/context/CategoryContext';
import {
  LayoutDashboard,
  FileText,
  Edit3,
  MessageSquare,
  Folder,
  Settings,
  LogOut,
  User
} from 'lucide-react';

const navigationItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/posts',
    label: 'Posts',
    icon: FileText,
  },
  {
    href: '/admin/editor',
    label: 'Editor',
    icon: Edit3,
  },
  {
    href: '/admin/comments',
    label: 'Comments',
    icon: MessageSquare,
    showBadge: true,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: Folder,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { posts } = usePosts();
  const { comments } = useComments();
  const { categories } = useCategories();

  const pendingComments = comments.filter(comment => comment.status === 'pending').length;
  const draftPosts = posts.filter(post => post.status === 'Draft').length;
  const inactiveCategories = categories.filter(category => category.status === 'inactive').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="Oussama" />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">Oussama</h3>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">Blog CMS</h2>
            <p className="text-xs text-gray-500">Content Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.showBadge && pendingComments > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {pendingComments}
                    </Badge>
                  )}
                  {item.label === 'Posts' && draftPosts > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {draftPosts}
                    </Badge>
                  )}
                  {item.label === 'Categories' && inactiveCategories > 0 && (
                    <Badge variant="outline" className="ml-auto">
                      {inactiveCategories}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-500">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{posts.length}</div>
              <div>Posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{comments.length}</div>
              <div>Comments</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{categories.length}</div>
              <div>Categories</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 border-gray-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
