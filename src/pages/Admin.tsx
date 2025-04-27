
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Blog } from '@/lib/supabase';
import BlogEditor from '@/components/BlogEditor';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Plus, Trash } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
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
  }, [toast]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleCreateBlog = async (blog: Partial<Blog>) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([blog])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setBlogs([data[0], ...blogs]);
        toast({
          title: "Blog created",
          description: "Your blog post has been published successfully!",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Failed to create blog",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateBlog = async (blog: Partial<Blog>) => {
    if (!selectedBlog) return;
    
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update(blog)
        .eq('id', selectedBlog.id)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setBlogs(blogs.map(b => b.id === selectedBlog.id ? data[0] : b));
        toast({
          title: "Blog updated",
          description: "Your blog post has been updated successfully!",
        });
        setIsEditing(false);
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Failed to update blog",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteBlog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast({
        title: "Blog deleted",
        description: "The blog post has been removed.",
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Failed to delete blog",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const resetEditing = () => {
    setSelectedBlog(null);
    setIsEditing(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blog-darkpurple">Admin Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogEditor 
              onSave={handleCreateBlog} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center">Loading blog posts...</div>
              ) : blogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {blog.title}
                        </TableCell>
                        <TableCell>{blog.category}</TableCell>
                        <TableCell>{blog.author}</TableCell>
                        <TableCell>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedBlog(blog);
                                setIsEditing(true);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the blog post
                                    "{blog.title}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBlog(blog.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium text-blog-gray mb-2">No blog posts yet</h3>
                  <p className="text-blog-gray mb-4">Create your first blog post to get started</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Blog Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Blog Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blog-lightgray rounded-lg p-4">
                  <p className="text-blog-gray mb-1">Total Posts</p>
                  <p className="text-3xl font-bold text-blog-darkpurple">{blogs.length}</p>
                </div>
                <div className="bg-blog-lightgray rounded-lg p-4">
                  <p className="text-blog-gray mb-1">Categories</p>
                  <p className="text-3xl font-bold text-blog-darkpurple">
                    {new Set(blogs.map(blog => blog.category)).size}
                  </p>
                </div>
                <div className="bg-blog-lightgray rounded-lg p-4">
                  <p className="text-blog-gray mb-1">Authors</p>
                  <p className="text-3xl font-bold text-blog-darkpurple">
                    {new Set(blogs.map(blog => blog.author)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditing} onOpenChange={(open) => !open && resetEditing()}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <BlogEditor 
              initialBlog={selectedBlog} 
              onSave={handleUpdateBlog} 
              onCancel={resetEditing}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
