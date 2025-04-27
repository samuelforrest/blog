
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import RichTextEditor from './RichTextEditor';
import { Blog } from '@/lib/supabase';

interface BlogEditorProps {
  initialBlog?: Blog;
  onSave: (blog: Partial<Blog>) => Promise<void>;
  onCancel: () => void;
}

const BlogEditor = ({ 
  initialBlog, 
  onSave, 
  onCancel 
}: BlogEditorProps) => {
  const [blog, setBlog] = useState<Partial<Blog>>(
    initialBlog || {
      title: '',
      content: '',
      cover_image: '',
      category: '',
      author: '',
    }
  );
  
  const [saving, setSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setBlog((prev) => ({ ...prev, content }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(blog);
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cover_image">Cover Image URL</Label>
        <Input
          id="cover_image"
          name="cover_image"
          value={blog.cover_image}
          onChange={handleChange}
          placeholder="Enter cover image URL (https://...)"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={blog.category}
            onChange={handleChange}
            placeholder="e.g., AI, Computer Science"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={blog.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <RichTextEditor
          content={blog.content}
          onChange={handleContentChange}
        />
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={saving}
        >
          {saving ? 'Saving...' : initialBlog ? 'Update Blog' : 'Create Blog'}
        </Button>
      </div>
    </form>
  );
};

export default BlogEditor;
