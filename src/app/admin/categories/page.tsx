"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useCategories } from '@/context/CategoryContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { ArrowUpDown, Plus, Palette } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  postCount: number;
  createdAt: string;
  status: 'active' | 'inactive';
};

export default function CategoriesPage() {
  const { categories, deleteCategory, updateCategoryStatus } = useCategories();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCategories = categories.filter((category) => {
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
    return matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (categoryId: string, newStatus: 'active' | 'inactive') => {
    updateCategoryStatus(categoryId, newStatus);
    toast.success(`Category status updated to ${newStatus}`);
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    deleteCategory(categoryId);
    toast.success(`Category "${categoryName}" has been deleted successfully`);
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Category Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: category.color }}
              title={`Color: ${category.color}`}
            />
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">/{category.slug}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px]">
            <span className="truncate block" title={description}>
              {description}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "postCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Posts
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableSorting: true,
      cell: ({ row }) => {
        const postCount = row.getValue("postCount") as number;
        return (
          <Badge variant="secondary" className="font-mono">
            {postCount}
          </Badge>
        );
      },
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
            Created
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
        const category = row.original;

        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-purple-600 hover:underline text-sm">
                  View
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Created on {new Date(category.createdAt).toLocaleDateString()} • {category.status} • {category.postCount} posts
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{category.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">Slug:</span>
                      <p className="text-gray-600 font-mono">/{category.slug}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Color:</span>
                      <p className="text-gray-600 font-mono">{category.color}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <button
              onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            
            <Select
              value={category.status}
              onValueChange={(value) => handleStatusChange(category.id, value as 'active' | 'inactive')}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                    This action cannot be undone. This will permanently delete the category
                    <strong> &ldquo;{category.name}&rdquo;</strong> and remove it from the system.
                    {category.postCount > 0 && (
                      <span className="text-red-600 font-semibold">
                        {' '}Warning: This category has {category.postCount} associated posts.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(category.id, category.name)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Category
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
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={() => router.push('/admin/categories/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 rounded-full"></div>
            Active: {categories.filter(c => c.status === 'active').length}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            Inactive: {categories.filter(c => c.status === 'inactive').length}
          </span>
          <span className="flex items-center gap-1">
            <Palette className="w-3 h-3" />
            Total: {categories.length}
          </span>
        </div>
      </div>
      
      <DataTable columns={columns} data={filteredCategories} />
    </div>
  );
}
