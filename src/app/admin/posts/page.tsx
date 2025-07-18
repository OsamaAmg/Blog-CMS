"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { usePosts } from '@/context/PostContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
};

export default function PostsPage() {
  const { posts, deletePost } = usePosts();
  const router = useRouter();
  const [filter, setFilter] = useState('');

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(filter.toLowerCase())
  );

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const post = row.original;

        const handleEdit = () => {
          router.push(`/admin/posts/edit/${post.id}`);
        };

        const handleDelete = () => {
          deletePost(post.id);
          toast.success(`Post "${post.title}" has been deleted successfully`);
        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-red-600 hover:underline text-sm">
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the post
                    <strong> &ldquo;{post.title}&rdquo;</strong> and remove it from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Post
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Button onClick={() => router.push('/admin/posts/new')}>
          Create New Post
        </Button>
      </div>
      <Input
        placeholder="Search by title..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />
      <DataTable columns={columns} data={filteredPosts} />
    </div>
  );
}
