
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Blog } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!category) return;
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .ilike('category', `%${category}%`)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs by category:', error);
        toast({
          title: "Failed to load blogs",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [category, toast]);
  
  // Format category for display (e.g., "computer-science" -> "Computer Science")
  const displayCategory = category
    ? category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/" className="flex items-center gap-2 text-blog-gray hover:text-blog-purple mb-6">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>
      
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blog-darkpurple mb-2">
          {displayCategory}
        </h1>
        <p className="text-lg text-blog-gray">
          Exploring topics in {displayCategory}
        </p>
      </section>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-blog-gray mb-2">No posts in this category</h2>
          <p className="text-blog-gray">Check back later for new content!</p>
        </div>
      )}
    </div>
  );
};

export default Category;
