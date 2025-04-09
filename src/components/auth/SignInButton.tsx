import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "lucide-react";

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
      aria-label="Anmelden"
    >
      <User className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!isMobile && "Anmelden"}
    </Button>
  );
};

export default SignInButton;
