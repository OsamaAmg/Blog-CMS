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
import { useComments } from '@/context/CommentContext';
import { usePosts } from '@/context/PostContext';
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";

type Comment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function CommentsPage() {
  const { comments, deleteComment, updateCommentStatus } = useComments();
  const { posts } = usePosts();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Create a map for quick post title lookup
  const postTitleMap = posts.reduce((acc, post) => {
    acc[post.id] = post.title;
    return acc;
  }, {} as Record<string, string>);

  const filteredComments = comments.filter((comment) => {
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (commentId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    updateCommentStatus(commentId, newStatus);
    toast.success(`Comment status updated to ${newStatus}`);
  };

  const handleDelete = (commentId: string, author: string) => {
    deleteComment(commentId);
    toast.success(`Comment by "${author}" has been deleted successfully`);
  };

  const columns: ColumnDef<Comment>[] = [
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
      accessorKey: "postId",
      header: "Post",
      cell: ({ row }) => {
        const postId = row.getValue("postId") as string;
        const postTitle = postTitleMap[postId] || 'Unknown Post';
        return (
          <div className="max-w-[200px]">
            <span className="truncate block" title={postTitle}>
              {postTitle}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "content",
      header: "Comment",
      cell: ({ row }) => {
        const content = row.getValue("content") as string;
        return (
          <div className="max-w-[300px]">
            <span className="truncate block" title={content}>
              {content}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
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
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const comment = row.original;

        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-purple-600 hover:underline text-sm">
                  View
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Comment by {comment.author}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    On &ldquo;{postTitleMap[comment.postId] || 'Unknown Post'}&rdquo; • {new Date(comment.createdAt).toLocaleDateString()} • {comment.status}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Select
              value={comment.status}
              onValueChange={(value) => handleStatusChange(comment.id, value as 'pending' | 'approved' | 'rejected')}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

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
                    This action cannot be undone. This will permanently delete the comment
                    by <strong>&ldquo;{comment.author}&rdquo;</strong> and remove it from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(comment.id, comment.author)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Comment
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
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="text-sm text-gray-600">
          {comments.length} total comments
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
            Pending: {comments.filter(c => c.status === 'pending').length}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 rounded-full"></div>
            Approved: {comments.filter(c => c.status === 'approved').length}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 rounded-full"></div>
            Rejected: {comments.filter(c => c.status === 'rejected').length}
          </span>
        </div>
      </div>
      
      <DataTable columns={columns} data={filteredComments} />
    </div>
  );
}
