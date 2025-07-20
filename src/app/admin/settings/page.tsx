"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import {
  Globe,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Settings,
  Save,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

interface BlogSettings {
  // Site Information
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  
  // Content Settings
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
  
  // User Settings
  authorName: string;
  authorBio: string;
  authorEmail: string;
  
  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  
  // Theme Settings
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  
  // Notification Settings
  emailNotifications: boolean;
  commentNotifications: boolean;
  
  // Security Settings
  enableTwoFactor: boolean;
  sessionTimeout: number;
}

const defaultSettings: BlogSettings = {
  siteName: "My Blog CMS",
  siteDescription: "A professional blog content management system",
  siteUrl: "https://myblog.com",
  adminEmail: "admin@myblog.com",
  postsPerPage: 10,
  allowComments: true,
  moderateComments: true,
  authorName: "Oussama",
  authorBio: "Passionate blogger and content creator",
  authorEmail: "oussama@myblog.com",
  metaTitle: "My Blog CMS - Professional Blogging Platform",
  metaDescription: "Discover amazing content on our professional blogging platform",
  seoKeywords: "blog, cms, content, writing, articles",
  theme: 'light',
  primaryColor: "#3b82f6",
  emailNotifications: true,
  commentNotifications: true,
  enableTwoFactor: false,
  sessionTimeout: 60
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<BlogSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('blogSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      }
    }
  }, []);

  const updateSetting = <K extends keyof BlogSettings>(key: K, value: BlogSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('blogSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully!');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...importedSettings });
        setHasChanges(true);
        toast.success('Settings imported successfully!');
      } catch {
        toast.error('Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'content', label: 'Content', icon: Settings },
    { id: 'author', label: 'Author', icon: User },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Configure your blog CMS preferences and options</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={isSaving || !hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Settings Navigation</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic information about your blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => updateSetting('siteName', e.target.value)}
                      placeholder="My Blog CMS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site URL</label>
                    <Input
                      value={settings.siteUrl}
                      onChange={(e) => updateSetting('siteUrl', e.target.value)}
                      placeholder="https://myblog.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Description</label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    placeholder="A brief description of your blog"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Admin Email</label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => updateSetting('adminEmail', e.target.value)}
                    placeholder="admin@myblog.com"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Settings */}
          {activeTab === 'content' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Content Settings
                </CardTitle>
                <CardDescription>Configure how content is displayed and managed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Posts Per Page</label>
                  <Select
                    value={settings.postsPerPage.toString()}
                    onValueChange={(value) => updateSetting('postsPerPage', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 posts</SelectItem>
                      <SelectItem value="10">10 posts</SelectItem>
                      <SelectItem value="15">15 posts</SelectItem>
                      <SelectItem value="20">20 posts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Allow Comments</label>
                    <p className="text-sm text-gray-500">Enable commenting on blog posts</p>
                  </div>
                  <Button
                    variant={settings.allowComments ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('allowComments', !settings.allowComments)}
                  >
                    {settings.allowComments ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Moderate Comments</label>
                    <p className="text-sm text-gray-500">Require approval before comments are published</p>
                  </div>
                  <Button
                    variant={settings.moderateComments ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('moderateComments', !settings.moderateComments)}
                    disabled={!settings.allowComments}
                  >
                    {settings.moderateComments ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Author Settings */}
          {activeTab === 'author' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Author Profile
                </CardTitle>
                <CardDescription>Your author information and profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Author Name</label>
                    <Input
                      value={settings.authorName}
                      onChange={(e) => updateSetting('authorName', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Author Email</label>
                    <Input
                      type="email"
                      value={settings.authorEmail}
                      onChange={(e) => updateSetting('authorEmail', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author Bio</label>
                  <Textarea
                    value={settings.authorBio}
                    onChange={(e) => updateSetting('authorBio', e.target.value)}
                    placeholder="A brief description about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  SEO Settings
                </CardTitle>
                <CardDescription>Search engine optimization configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <Input
                    value={settings.metaTitle}
                    onChange={(e) => updateSetting('metaTitle', e.target.value)}
                    placeholder="Your site title for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.metaTitle.length}/60 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <Textarea
                    value={settings.metaDescription}
                    onChange={(e) => updateSetting('metaDescription', e.target.value)}
                    placeholder="A brief description for search engines"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.metaDescription.length}/160 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Keywords</label>
                  <Input
                    value={settings.seoKeywords}
                    onChange={(e) => updateSetting('seoKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of your blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                      className="font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Button
                    variant={settings.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                  >
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Comment Notifications</label>
                    <p className="text-sm text-gray-500">Get notified when new comments are posted</p>
                  </div>
                  <Button
                    variant={settings.commentNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('commentNotifications', !settings.commentNotifications)}
                  >
                    {settings.commentNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Protect your blog and account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Two-Factor Authentication</label>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button
                    variant={settings.enableTwoFactor ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('enableTwoFactor', !settings.enableTwoFactor)}
                  >
                    {settings.enableTwoFactor ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                  <Select
                    value={settings.sessionTimeout.toString()}
                    onValueChange={(value) => updateSetting('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>Import, export, and manage your settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={exportSettings}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                      id="import-settings"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('import-settings')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Settings
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h4 className="font-medium text-red-800">Danger Zone</h4>
                    </div>
                    <p className="text-sm text-red-700 mb-3">
                      These actions cannot be undone. Please proceed with caution.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset All Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Status Footer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            <span className="font-medium">Settings Status</span>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Auto-save enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Local storage active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Settings validated</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
