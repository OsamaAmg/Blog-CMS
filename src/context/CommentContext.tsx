'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Comment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type CommentContextType = {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deleteComment: (id: string) => void;
  updateComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  updateCommentStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  getComment: (id: string) => Comment | undefined;
  getCommentsByPost: (postId: string) => Comment[];
};

const CommentContext = createContext<CommentContextType | undefined>(undefined);

// Default comments to use when localStorage is empty
const DEFAULT_COMMENTS: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: 'Ahmed Hassan',
    content: 'Great article! I really enjoyed reading about Next.js features. The explanation of server-side rendering was particularly helpful.',
    status: 'approved',
    createdAt: '2025-07-15T10:30:00Z',
  },
  {
    id: '2',
    postId: '1',
    author: 'Sarah Johnson',
    content: 'Thanks for sharing this. Could you write more about the app router? I\'m still getting confused between pages and app router.',
    status: 'approved',
    createdAt: '2025-07-15T14:20:00Z',
  },
  {
    id: '3',
    postId: '2',
    author: 'Mike Chen',
    content: 'This is exactly what I was looking for! React Server Components seem powerful but complex.',
    status: 'pending',
    createdAt: '2025-07-16T09:15:00Z',
  },
  {
    id: '4',
    postId: '3',
    author: 'Lisa Rodriguez',
    content: 'Tailwind CSS has been a game changer for my workflow. Love the utility-first approach!',
    status: 'approved',
    createdAt: '2025-07-16T16:45:00Z',
  },
  {
    id: '5',
    postId: '1',
    author: 'Anonymous User',
    content: 'This article is terrible and completely wrong. Next.js is overrated.',
    status: 'rejected',
    createdAt: '2025-07-17T08:30:00Z',
  },
  {
    id: '6',
    postId: '2',
    author: 'David Kim',
    content: 'Could you provide some practical examples? The theory is good but I need to see it in action.',
    status: 'pending',
    createdAt: '2025-07-17T12:00:00Z',
  },
  {
    id: '7',
    postId: '3',
    author: 'Emma Thompson',
    content: 'I\'ve been using Bootstrap for years. Should I really switch to Tailwind? What are the main benefits?',
    status: 'approved',
    createdAt: '2025-07-17T20:15:00Z',
  },
];

// localStorage helper functions
const STORAGE_KEY = 'blog-cms-comments';

const loadCommentsFromStorage = (): Comment[] => {
  if (typeof window === 'undefined') return DEFAULT_COMMENTS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load comments from localStorage:', error);
  }
  
  return DEFAULT_COMMENTS;
};

const saveCommentsToStorage = (comments: Comment[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch (error) {
    console.error('Failed to save comments to localStorage:', error);
  }
};

export function CommentProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>(loadCommentsFromStorage);

  // Sync comments to localStorage whenever comments change
  useEffect(() => {
    saveCommentsToStorage(comments);
  }, [comments]);

  function addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
    const newComment: Comment = {
      id: String(Date.now()), // Use timestamp for unique ID
      createdAt: new Date().toISOString(),
      ...comment,
    };
    setComments((prev) => [newComment, ...prev]);
  }

  function deleteComment(id: string) {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  }

  function updateComment(id: string, updatedComment: Omit<Comment, 'id' | 'createdAt'>) {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, ...updatedComment }
          : comment
      )
    );
  }

  function updateCommentStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, status }
          : comment
      )
    );
  }

  function getComment(id: string): Comment | undefined {
    return comments.find((comment) => comment.id === id);
  }

  function getCommentsByPost(postId: string): Comment[] {
    return comments.filter((comment) => comment.postId === postId);
  }

  return (
    <CommentContext.Provider value={{ 
      comments, 
      addComment, 
      deleteComment, 
      updateComment, 
      updateCommentStatus,
      getComment,
      getCommentsByPost
    }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
}
