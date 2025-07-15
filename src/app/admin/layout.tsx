export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <nav className="flex flex-col gap-2">
          <a href="/admin/dashboard" className="hover:underline">Dashboard</a>
          <a href="/admin/posts" className="hover:underline">Posts</a>
          <a href="/admin/editor" className="hover:underline">Editor</a>
          <a href="/admin/comments" className="hover:underline">Comments</a>
          <a href="/admin/categories" className="hover:underline">Categories</a>
          <a href="/admin/settings" className="hover:underline">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
}
