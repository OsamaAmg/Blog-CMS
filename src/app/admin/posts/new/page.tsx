'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { usePosts } from '@/context/PostContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function NewPostPage() {
  const { addPost } = usePosts();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for the post');
      return;
    }

    setIsSubmitting(true);
    
    try {
      addPost({ title: title.trim(), content: content.trim(), author: 'Oussama', status });
      toast.success(`Post "${title.trim()}" has been created successfully`);
      
      // Clear inputs
      setTitle('');
      setContent('');
      setStatus('Draft');
      
      // Redirect to posts page
      router.push('/admin/posts');
    } catch (err) {
      console.error('Failed to create post:', err);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={!title.trim() && title.length > 0 ? "border-red-500" : ""}
        />
        <Textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
          className="w-full border border-input rounded-md p-2"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
    // for git setting //
  );
}
