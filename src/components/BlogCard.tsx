
import { Link } from 'react-router-dom';
import { Blog } from '@/lib/supabase';
import { Card, CardContent, CardFooter } from './ui/card';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <Link to={`/blog/${blog.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={blog.cover_image} 
            alt={blog.title} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium">
            {blog.category}
          </div>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-xl font-semibold line-clamp-2 mb-2">{blog.title}</h3>
          <p className="text-blog-gray line-clamp-3 text-sm">
            {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
          </p>
        </CardContent>
        <CardFooter className="text-sm text-blog-gray flex justify-between items-center border-t pt-4">
          <span>{blog.author}</span>
          <span>{formattedDate}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
