
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SignInButtonProps {
  onClick: () => void;
}

const SignInButton = ({ onClick }: SignInButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <Button 
      variant="outline" 
      size={isMobile ? "icon" : "sm"} 
      onClick={onClick}
      className="whitespace-nowrap"
      aria-label="Sign In"
    >
      <User className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!isMobile && "Sign In"}
    </Button>
  );
};

export default SignInButton;
