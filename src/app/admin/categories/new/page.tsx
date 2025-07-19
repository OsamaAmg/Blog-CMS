'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useCategories } from '@/context/CategoryContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const COLOR_OPTIONS = [
  '#3B82F6', '#06B6D4', '#8B5CF6', '#F59E0B',
  '#10B981', '#EF4444', '#EC4899', '#84CC16',
  '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
];

export default function NewCategoryPage() {
  const { addCategory } = useCategories();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (!slug.trim()) {
      toast.error('Please enter a valid slug');
      return;
    }

    setIsSubmitting(true);
    
    try {
      addCategory({ 
        name: name.trim(), 
        description: description.trim(),
        slug: slug.trim(),
        color,
        status
      });
      toast.success(`Category "${name.trim()}" has been created successfully`);
      
      // Clear inputs
      setName('');
      setDescription('');
      setSlug('');
      setColor(COLOR_OPTIONS[0]);
      setStatus('active');
      
      // Redirect to categories page
      router.push('/admin/categories');
    } catch (err) {
      console.error('Failed to create category:', err);
      toast.error('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <Input
            placeholder="e.g., Web Development"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className={!name.trim() && name.length > 0 ? "border-red-500" : ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <Input
            placeholder="e.g., web-development"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className={!slug.trim() && slug.length > 0 ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly version of the name. Auto-generated from name.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            placeholder="Brief description of this category..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_OPTIONS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                onClick={() => setColor(colorOption)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  color === colorOption 
                    ? 'border-gray-900 scale-110' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: colorOption }}
                title={colorOption}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Selected color: {color}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="w-full border border-input rounded-md p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/categories')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
