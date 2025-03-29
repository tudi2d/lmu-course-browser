
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import UserMenu from '@/components/auth/UserMenu';
import SignInButton from '@/components/auth/SignInButton';
import AuthDialog from '@/components/auth/AuthDialog';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="border-b border-slate-200 py-3 px-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {isMobile && onMenuClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 mr-2 p-0"
              onClick={onMenuClick}
            >
              <Menu size={20} />
            </Button>
          )}
          <h1 className="text-lg font-bold tracking-tight text-black">lmu course browser</h1>
        </div>
        
        {user ? (
          <UserMenu user={user} />
        ) : (
          <SignInButton onClick={() => setAuthDialogOpen(true)} />
        )}
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </nav>
  );
};

export default Navbar;
