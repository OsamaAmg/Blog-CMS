'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
};

type PostContextType = {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'date'>) => void;
  deletePost: (id: string) => void;
  updatePost: (id: string, post: Omit<Post, 'id' | 'date'>) => void;
  getPost: (id: string) => Post | undefined;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Building a Blog with Next.js',
      author: 'Oussama',
      date: '2025-07-14',
      status: 'Published',
    },
    {
      id: '2',
      title: 'Understanding React Server Components',
      author: 'Oussama',
      date: '2025-07-10',
      status: 'Draft',
    },
    {
      id: '3',
      title: 'Styling with Tailwind CSS',
      author: 'Oussama',
      date: '2025-07-12',
      status: 'Published',
    },
  ]);

  function addPost(post: Omit<Post, 'id' | 'date'>) {
    const newPost: Post = {
      id: String(posts.length + 1),
      date: new Date().toISOString().slice(0, 10),
      ...post,
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function deletePost(id: string) {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }

  function updatePost(id: string, updatedPost: Omit<Post, 'id' | 'date'>) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, ...updatedPost }
          : post
      )
    );
  }

  function getPost(id: string): Post | undefined {
    return posts.find((post) => post.id === id);
  }

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, updatePost, getPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}
