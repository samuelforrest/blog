
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Book className="h-12 w-12 text-blog-purple opacity-70" />
        </div>
        <h1 className="text-4xl font-bold text-blog-darkpurple mb-4">Page Not Found</h1>
        <p className="text-blog-gray mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
