
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import UserMenu from '@/components/auth/UserMenu';
import SignInButton from '@/components/auth/SignInButton';
import AuthDialog from '@/components/auth/AuthDialog';

const Navbar = () => {
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200 py-3 px-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight text-black">lmu course browser</h1>
        
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
