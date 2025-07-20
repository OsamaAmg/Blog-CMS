"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePosts } from '@/context/PostContext';
import { useComments } from '@/context/CommentContext';
import { useCategories } from '@/context/CategoryContext';
import { useRouter } from 'next/navigation';
import {
  FileText,
  MessageSquare,
  Hash,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Plus,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit3
} from "lucide-react";

export default function DashboardPage() {
  const { posts } = usePosts();
  const { comments } = useComments();
  const { categories } = useCategories();
  const router = useRouter();

  // Calculate statistics
  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(post => post.status === 'Published').length,
    draftPosts: posts.filter(post => post.status === 'Draft').length,
    totalComments: comments.length,
    pendingComments: comments.filter(comment => comment.status === 'pending').length,
    approvedComments: comments.filter(comment => comment.status === 'approved').length,
    rejectedComments: comments.filter(comment => comment.status === 'rejected').length,
    totalCategories: categories.length,
    activeCategories: categories.filter(cat => cat.status === 'active').length,
  };

  // Recent activity data
  const recentPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentComments = comments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Quick actions
  const quickActions = [
    {
      title: 'New Post',
      description: 'Create a new blog post',
      icon: Plus,
      action: () => router.push('/admin/editor'),
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Posts',
      description: 'View and edit all posts',
      icon: FileText,
      action: () => router.push('/admin/posts'),
      color: 'bg-green-500'
    },
    {
      title: 'Review Comments',
      description: 'Moderate pending comments',
      icon: MessageSquare,
      action: () => router.push('/admin/comments'),
      color: 'bg-yellow-500'
    },
    {
      title: 'Categories',
      description: 'Manage post categories',
      icon: Hash,
      action: () => router.push('/admin/categories'),
      color: 'bg-purple-500'
    }
  ];

  const getPostTitle = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.title || 'Unknown Post';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Published':
      case 'approved':
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Draft':
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your blog.</p>
        </div>
        <Button onClick={() => router.push('/admin/editor')}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="mr-1">{stats.publishedPosts}</Badge>
              Published
              <Badge variant="outline" className="ml-2 mr-1">{stats.draftPosts}</Badge>
              Drafts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.pendingComments > 0 && (
                <>
                  <Badge variant="destructive" className="mr-1">{stats.pendingComments}</Badge>
                  Pending
                </>
              )}
              {stats.pendingComments === 0 && (
                <span className="text-green-600">All reviewed</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="mr-1">{stats.activeCategories}</Badge>
              Active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalComments > 0 ? (stats.totalComments / Math.max(stats.publishedPosts, 1)).toFixed(1) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Comments per post
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={action.action}
              >
                <div className={`p-2 rounded-md mr-3 ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>Your latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{post.title}</h4>
                        {getStatusIcon(post.status)}
                        <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {post.author}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet. Create your first post to get started!</p>
                <Button className="mt-4" onClick={() => router.push('/admin/editor')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Comments
            </CardTitle>
            <CardDescription>Latest comments from readers</CardDescription>
          </CardHeader>
          <CardContent>
            {recentComments.length > 0 ? (
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {comment.author.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{comment.author}</span>
                        {getStatusIcon(comment.status)}
                        <Badge variant={
                          comment.status === 'approved' ? 'default' : 
                          comment.status === 'pending' ? 'secondary' : 'destructive'
                        } className="text-xs">
                          {comment.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      On: {getPostTitle(comment.postId)}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push('/admin/comments')}>
                  View All Comments
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Comments will appear here once readers start engaging with your posts.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Overview
            </CardTitle>
            <CardDescription>Summary of your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Published Posts</span>
                <span className="text-sm text-muted-foreground">{stats.publishedPosts} / {stats.totalPosts}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.totalPosts > 0 ? (stats.publishedPosts / stats.totalPosts) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approved Comments</span>
                <span className="text-sm text-muted-foreground">{stats.approvedComments} / {stats.totalComments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${stats.totalComments > 0 ? (stats.approvedComments / stats.totalComments) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Categories</span>
                <span className="text-sm text-muted-foreground">{stats.activeCategories} / {stats.totalCategories}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${stats.totalCategories > 0 ? (stats.activeCategories / stats.totalCategories) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Category List */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Active Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.filter(cat => cat.status === 'active').slice(0, 6).map((category) => (
                  <Badge key={category.id} variant="outline" className="text-xs">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </Badge>
                ))}
                {categories.filter(cat => cat.status === 'active').length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{categories.filter(cat => cat.status === 'active').length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      {stats.pendingComments > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800">
                  You have {stats.pendingComments} comment{stats.pendingComments !== 1 ? 's' : ''} waiting for approval.
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Review and moderate these comments to keep your blog engagement active.
                </p>
              </div>
              <Button onClick={() => router.push('/admin/comments')} className="bg-yellow-600 hover:bg-yellow-700">
                Review Comments
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
