
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Blog } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast({
          title: "Failed to load blog post",
          description: "The post may not exist or has been removed.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
          <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-blog-darkpurple mb-4">Blog post not found</h1>
        <p className="mb-6 text-blog-gray">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="flex items-center justify-center gap-2 text-blog-purple hover:text-blog-darkpurple">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }
  
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link to="/" className="flex items-center gap-2 text-blog-gray hover:text-blog-purple mb-6">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold text-blog-darkpurple mb-4">{blog.title}</h1>
      
      <div className="flex flex-wrap gap-3 items-center text-blog-gray mb-6">
        <span>By {blog.author}</span>
        <span>•</span>
        <span>{formattedDate}</span>
        <span>•</span>
        <span className="bg-blog-lightgray px-3 py-1 rounded-full text-sm">{blog.category}</span>
      </div>
      
      <div className="mb-8">
        <img 
          src={blog.cover_image} 
          alt={blog.title} 
          className="w-full h-auto rounded-lg object-cover aspect-video" 
        />
      </div>
      
      <article 
        className="prose max-w-full blog-content" 
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogPost;
