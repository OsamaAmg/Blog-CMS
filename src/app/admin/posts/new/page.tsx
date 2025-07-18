'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content, status });
    // Later: POST to backend or local API route
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}
