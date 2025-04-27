
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Book, LogIn } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to the admin dashboard!",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Login failed",
          description: "The password is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-16 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Book className="h-6 w-6 text-blog-purple" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </div>
          <CardDescription>
            Enter the admin password to manage blog posts
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
