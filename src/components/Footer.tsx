
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted py-4 px-6 text-center border-t">
      <div className="container mx-auto">
        <div className="flex justify-center items-center text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} LMU Course Browser</span>
          <span className="mx-2">•</span>
          <Link to="/legal" className="hover:text-primary transition-colors">
            Impressum & Legal
          </Link>
          <span className="mx-2">•</span>
          <a 
            href="https://github.com/tudi2d/lmu-course-browser" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center"
          >
            <Github size={14} className="mr-1" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
