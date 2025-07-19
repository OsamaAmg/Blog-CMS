'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  postCount: number;
  createdAt: string;
  status: 'active' | 'inactive';
};

type CategoryContextType = {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'postCount'>) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, category: Omit<Category, 'id' | 'createdAt' | 'postCount'>) => void;
  updateCategoryStatus: (id: string, status: 'active' | 'inactive') => void;
  getCategory: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Default categories to use when localStorage is empty
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Articles about modern web development technologies, frameworks, and best practices.',
    slug: 'web-development',
    color: '#3B82F6',
    postCount: 2,
    createdAt: '2025-07-10T10:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'React',
    description: 'Deep dives into React concepts, hooks, components, and the React ecosystem.',
    slug: 'react',
    color: '#06B6D4',
    postCount: 1,
    createdAt: '2025-07-11T14:30:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'CSS & Styling',
    description: 'Modern CSS techniques, frameworks like Tailwind, and styling best practices.',
    slug: 'css-styling',
    color: '#8B5CF6',
    postCount: 1,
    createdAt: '2025-07-12T09:15:00Z',
    status: 'active',
  },
  {
    id: '4',
    name: 'JavaScript',
    description: 'Core JavaScript concepts, ES6+ features, and advanced programming patterns.',
    slug: 'javascript',
    color: '#F59E0B',
    postCount: 0,
    createdAt: '2025-07-13T16:45:00Z',
    status: 'active',
  },
  {
    id: '5',
    name: 'Backend Development',
    description: 'Server-side development, APIs, databases, and backend architectures.',
    slug: 'backend-development',
    color: '#10B981',
    postCount: 0,
    createdAt: '2025-07-14T11:20:00Z',
    status: 'inactive',
  },
  {
    id: '6',
    name: 'DevOps',
    description: 'Deployment, CI/CD, containerization, and development operations.',
    slug: 'devops',
    color: '#EF4444',
    postCount: 0,
    createdAt: '2025-07-15T13:00:00Z',
    status: 'inactive',
  },
];

// localStorage helper functions
const STORAGE_KEY = 'blog-cms-categories';

const loadCategoriesFromStorage = (): Category[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load categories from localStorage:', error);
  }
  
  return DEFAULT_CATEGORIES;
};

const saveCategoriesToStorage = (categories: Category[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories to localStorage:', error);
  }
};

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(loadCategoriesFromStorage);

  // Sync categories to localStorage whenever categories change
  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  function addCategory(category: Omit<Category, 'id' | 'createdAt' | 'postCount'>) {
    const newCategory: Category = {
      id: String(Date.now()), // Use timestamp for unique ID
      createdAt: new Date().toISOString(),
      postCount: 0, // New categories start with 0 posts
      ...category,
    };
    setCategories((prev) => [newCategory, ...prev]);
  }

  function deleteCategory(id: string) {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  }

  function updateCategory(id: string, updatedCategory: Omit<Category, 'id' | 'createdAt' | 'postCount'>) {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, ...updatedCategory }
          : category
      )
    );
  }

  function updateCategoryStatus(id: string, status: 'active' | 'inactive') {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, status }
          : category
      )
    );
  }

  function getCategory(id: string): Category | undefined {
    return categories.find((category) => category.id === id);
  }

  function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((category) => category.slug === slug);
  }

  return (
    <CategoryContext.Provider value={{ 
      categories, 
      addCategory, 
      deleteCategory, 
      updateCategory, 
      updateCategoryStatus,
      getCategory,
      getCategoryBySlug
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
