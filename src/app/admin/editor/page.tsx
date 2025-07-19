"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from 'react';
import { usePosts } from '@/context/PostContext';
import { useCategories } from '@/context/CategoryContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  ImageIcon,
  Eye,
  Save,
  FileText,
  Palette,
  Tag,
  Hash,
  Type
} from "lucide-react";

export default function EditorPage() {
  const { addPost } = usePosts();
  const { categories } = useCategories();
  const router = useRouter();
  
  // Editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [featuredImage, setFeaturedImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 16));
  
  // Editor UI state
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich');
  
  // Rich text editor state
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentFormat, setCurrentFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Auto-generate SEO title from main title
  useEffect(() => {
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(title);
    }
  }, [title, seoTitle]);

  // Update word and character counts
  useEffect(() => {
    const text = editorMode === 'rich' 
      ? editorRef.current?.textContent || ''
      : content;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(text.trim() === '' ? 0 : words);
    setCharacterCount(text.length);
  }, [content, editorMode]);

  // Rich text formatting functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateFormatState();
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const updateFormatState = () => {
    setCurrentFormat({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
      updateFormatState();
    }
  };

  const handleEditorFocus = () => {
    updateFormatState();
  };

  // Markdown formatting functions (for markdown mode)
  const insertAtCursor = (textArea: HTMLTextAreaElement, insertText: string) => {
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const newContent = content.substring(0, start) + insertText + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textArea.selectionStart = textArea.selectionEnd = start + insertText.length;
      textArea.focus();
    }, 0);
  };

  const wrapSelection = (textArea: HTMLTextAreaElement, before: string, after: string = before) => {
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = before + selectedText + after;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      if (selectedText) {
        textArea.selectionStart = start;
        textArea.selectionEnd = start + newText.length;
      } else {
        textArea.selectionStart = textArea.selectionEnd = start + before.length;
      }
      textArea.focus();
    }, 0);
  };

  const formatText = (format: string) => {
    if (editorMode === 'rich') {
      // Rich text formatting
      switch (format) {
        case 'bold':
          execCommand('bold');
          break;
        case 'italic':
          execCommand('italic');
          break;
        case 'underline':
          execCommand('underline');
          break;
        case 'heading1':
          execCommand('formatBlock', 'H1');
          break;
        case 'heading2':
          execCommand('formatBlock', 'H2');
          break;
        case 'heading3':
          execCommand('formatBlock', 'H3');
          break;
        case 'paragraph':
          execCommand('formatBlock', 'P');
          break;
        case 'list':
          execCommand('insertUnorderedList');
          break;
        case 'orderedList':
          execCommand('insertOrderedList');
          break;
        case 'quote':
          execCommand('formatBlock', 'BLOCKQUOTE');
          break;
        case 'link':
          const url = prompt('Enter URL:');
          if (url) {
            execCommand('createLink', url);
          }
          break;
        case 'code':
          execCommand('formatBlock', 'PRE');
          break;
      }
    } else {
      // Markdown formatting
      const textArea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
      if (!textArea) return;

      switch (format) {
        case 'bold':
          wrapSelection(textArea, '**');
          break;
        case 'italic':
          wrapSelection(textArea, '*');
          break;
        case 'underline':
          wrapSelection(textArea, '<u>', '</u>');
          break;
        case 'code':
          wrapSelection(textArea, '`');
          break;
        case 'quote':
          insertAtCursor(textArea, '\n> ');
          break;
        case 'list':
          insertAtCursor(textArea, '\n- ');
          break;
        case 'orderedList':
          insertAtCursor(textArea, '\n1. ');
          break;
        case 'link':
          wrapSelection(textArea, '[', '](url)');
          break;
        case 'image':
          insertAtCursor(textArea, '\n![Alt text](image-url)\n');
          break;
        case 'heading1':
          insertAtCursor(textArea, '\n# ');
          break;
        case 'heading2':
          insertAtCursor(textArea, '\n## ');
          break;
        case 'heading3':
          insertAtCursor(textArea, '\n### ');
          break;
      }
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const convertHtmlToPlainText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for the post');
      return;
    }

    const finalContent = editorMode === 'rich' 
      ? convertHtmlToPlainText(content)
      : content;

    if (!finalContent.trim()) {
      toast.error('Please enter content for the post');
      return;
    }

    setIsSubmitting(true);
    
    try {
      addPost({ 
        title: title.trim(), 
        content: finalContent.trim(), 
        author: 'Oussama', 
        status 
      });
      
      toast.success(`Post "${title.trim()}" has been ${status === 'Published' ? 'published' : 'saved as draft'} successfully`);
      
      // Clear form
      setTitle('');
      setContent('');
      setExcerpt('');
      setSelectedCategories([]);
      setTags('');
      setSeoTitle('');
      setSeoDescription('');
      setFeaturedImage('');
      setStatus('Draft');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      
      // Redirect to posts page
      router.push('/admin/posts');
    } catch (err) {
      console.error('Failed to save post:', err);
      toast.error('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Preview Mode</h1>
          <Button onClick={() => setPreviewMode(false)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{title || 'Untitled Post'}</CardTitle>
            <CardDescription>
              By Oussama • {new Date(publishDate).toLocaleDateString()} • {status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              {editorMode === 'rich' ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: content || 'No content yet...' }}
                  className="leading-relaxed"
                />
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {content || 'No content yet...'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Editor</h1>
        <div className="flex items-center gap-2">
          <Select value={editorMode} onValueChange={(value: 'rich' | 'markdown') => setEditorMode(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rich">Rich Text</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setPreviewMode(true)} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Badge variant="secondary">
            {wordCount} words, {characterCount} characters
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Post Content
                <Badge variant="outline" className="ml-auto">
                  {editorMode === 'rich' ? 'WYSIWYG Editor' : 'Markdown Editor'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg font-semibold"
              />
              
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 border rounded-md bg-gray-50">
                <Button
                  type="button"
                  variant={currentFormat.bold ? "default" : "ghost"}
                  size="sm"
                  onClick={() => formatText('bold')}
                  title="Bold"
                  className={currentFormat.bold ? "bg-blue-500 text-white" : ""}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={currentFormat.italic ? "default" : "ghost"}
                  size="sm"
                  onClick={() => formatText('italic')}
                  title="Italic"
                  className={currentFormat.italic ? "bg-blue-500 text-white" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={currentFormat.underline ? "default" : "ghost"}
                  size="sm"
                  onClick={() => formatText('underline')}
                  title="Underline"
                  className={currentFormat.underline ? "bg-blue-500 text-white" : ""}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('heading1')}
                  title="Heading 1"
                  className="font-bold"
                >
                  H1
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('heading2')}
                  title="Heading 2"
                  className="font-bold"
                >
                  H2
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('heading3')}
                  title="Heading 3"
                  className="font-bold"
                >
                  H3
                </Button>
                {editorMode === 'rich' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('paragraph')}
                    title="Paragraph"
                  >
                    P
                  </Button>
                )}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('list')}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('orderedList')}
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('quote')}
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('code')}
                  title="Code"
                >
                  <Code className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('link')}
                  title="Link"
                >
                  <Link className="h-4 w-4" />
                </Button>
                {editorMode === 'markdown' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText('image')}
                    title="Image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Rich Text Editor */}
              {editorMode === 'rich' ? (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  onFocus={handleEditorFocus}
                  onKeyUp={handleEditorFocus}
                  onMouseUp={handleEditorFocus}
                  className="rich-text-editor prose prose-gray max-w-none"
                  suppressContentEditableWarning={true}
                  data-placeholder="Start writing your content here... Use the toolbar above for formatting."
                />
              ) : (
                /* Markdown Editor */
                <Textarea
                  id="markdown-editor"
                  placeholder="Start writing your content here... Use markdown syntax or the toolbar above for formatting."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm leading-relaxed resize-none"
                />
              )}

              <Textarea
                placeholder="Write a brief excerpt (optional)..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={status} onValueChange={(value: 'Draft' | 'Published') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Publish Date</label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full border border-input rounded-md p-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Saving...' : status === 'Published' ? 'Publish' : 'Save Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.filter(cat => cat.status === 'active').map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded border-gray-300"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter tags separated by commas..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Image URL..."
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">SEO Title</label>
                <Input
                  placeholder="SEO optimized title..."
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <Textarea
                  placeholder="Brief description for search engines..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seoDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
