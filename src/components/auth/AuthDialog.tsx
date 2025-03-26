
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? "Create a new account to save your favorite courses" 
              : "Sign in to your account to access your favorites"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          {authError && (
            <div className="text-destructive text-sm">{authError}</div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={authLoading}
            >
              {isSignUp ? "Already have an account?" : "Need an account?"}
            </Button>
            
            <Button type="submit" disabled={authLoading}>
              {authLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
