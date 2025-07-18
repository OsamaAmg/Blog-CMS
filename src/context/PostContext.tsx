'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Post = {
  id: string;
  title: string;
  content: string;
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

// Default posts to use when localStorage is empty
const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'Building a Blog with Next.js',
    content: 'Next.js is a powerful React framework that makes building modern web applications a breeze. In this post, we\'ll explore the key features that make Next.js stand out, including server-side rendering, static site generation, and the new app router.',
    author: 'Oussama',
    date: '2025-07-14',
    status: 'Published',
  },
  {
    id: '2',
    title: 'Understanding React Server Components',
    content: 'React Server Components represent a new paradigm in React development. They allow us to render components on the server, reducing the JavaScript bundle size and improving performance. Let\'s dive into how they work and when to use them.',
    author: 'Oussama',
    date: '2025-07-10',
    status: 'Draft',
  },
  {
    id: '3',
    title: 'Styling with Tailwind CSS',
    content: 'Tailwind CSS has revolutionized how we approach styling in modern web development. With its utility-first approach, we can build beautiful, responsive designs quickly and efficiently. This guide covers the fundamentals and best practices.',
    author: 'Oussama',
    date: '2025-07-12',
    status: 'Published',
  },
];

// localStorage helper functions
const STORAGE_KEY = 'blog-cms-posts';

const loadPostsFromStorage = (): Post[] => {
  if (typeof window === 'undefined') return DEFAULT_POSTS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load posts from localStorage:', error);
  }
  
  return DEFAULT_POSTS;
};

const savePostsToStorage = (posts: Post[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
  }
};

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(loadPostsFromStorage);

  // Sync posts to localStorage whenever posts change
  useEffect(() => {
    savePostsToStorage(posts);
  }, [posts]);

  function addPost(post: Omit<Post, 'id' | 'date'>) {
    const newPost: Post = {
      id: String(Date.now()), // Use timestamp for unique ID
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
