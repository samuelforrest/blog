
import { Book } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8 mt-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Book className="h-5 w-5 text-blog-purple" />
            <span className="text-lg font-semibold text-blog-darkpurple">BloggyAI</span>
          </div>
          
          <div className="text-sm text-blog-gray">
            <p>© {new Date().getFullYear()} BloggyAI. All rights reserved.</p>
            <p>A Computer Science and AI Blog.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
