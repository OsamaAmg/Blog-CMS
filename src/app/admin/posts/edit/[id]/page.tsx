'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { usePosts } from '@/context/PostContext';
import { useRouter, useParams } from 'next/navigation';
import { toast } from "sonner";

export default function EditPostPage() {
  const { updatePost, getPost } = usePosts();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const post = getPost(postId);
    if (post) {
      setTitle(post.title);
      setContent(''); // We don't have content in our Post type yet
      setStatus(post.status);
      setLoading(false);
    } else {
      // Post not found, show error and redirect
      toast.error('Post not found');
      router.push('/admin/posts');
    }
  }, [postId, getPost, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for the post');
      return;
    }

    setIsSubmitting(true);
    
    try {
      updatePost(postId, { title: title.trim(), author: 'Oussama', status });
      toast.success(`Post "${title.trim()}" has been updated successfully`);
      router.push('/admin/posts');
    } catch (error) {
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
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
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/posts')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
