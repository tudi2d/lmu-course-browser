import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-muted py-4 px-6 text-center border-t">
      <div className="container mx-auto">
        <div className="flex justify-center items-center text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} LMU Course Browser</span>
          <span className="mx-2">•</span>
          <Link to="/legal" className="hover:text-primary transition-colors">
            Impressum & Legal
          </Link>
          <span className="mx-2">•</span>
          <a href="https://github.com/tudi2d/lmu-course-browser" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <span className="mx-2">•</span>
          <a href="https://lovable.dev/projects/0d01a7f3-8cc0-4d63-99d9-ea4e7a2ba448" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Remix on Lovable</a>
        </div>
      </div>
    </footer>;
};
export default Footer;