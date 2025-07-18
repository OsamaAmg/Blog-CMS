"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { usePosts } from '@/context/PostContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
};

export default function PostsPage() {
  const { posts, deletePost } = usePosts();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesStatus;
  });

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "author",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Author
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "Published"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
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
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-purple-600 hover:underline text-sm">
                  Preview
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {post.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    By {post.author} on {new Date(post.date).toLocaleDateString()} • {post.status}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
      
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <DataTable columns={columns} data={filteredPosts} />
    </div>
  );
}
