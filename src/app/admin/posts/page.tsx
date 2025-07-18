"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
};

const posts: Post[] = [
  {
    id: "1",
    title: "Building a Blog with Next.js",
    author: "Oussama",
    date: "2025-07-14",
    status: "Published",
  },
  {
    id: "2",
    title: "Understanding React Server Components",
    author: "Oussama",
    date: "2025-07-10",
    status: "Draft",
  },
  {
    id: "3",
    title: "Styling with Tailwind CSS",
    author: "Oussama",
    date: "2025-07-12",
    status: "Published",
  },
];

export default function PostsPage() {
  const [filter, setFilter] = useState("");

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

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => console.log("Edit", post.id)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => console.log("Delete", post.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Posts</h2>
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
