
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Book } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6 text-blog-purple" />
          <Link to="/" className="text-xl font-bold text-blog-darkpurple">BloggyAI</Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-blog-darkgray hover:text-blog-purple transition-colors">Home</Link>
          <Link to="/category/ai" className="text-blog-darkgray hover:text-blog-purple transition-colors">AI</Link>
          <Link to="/category/computer-science" className="text-blog-darkgray hover:text-blog-purple transition-colors">Computer Science</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline">Admin Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
