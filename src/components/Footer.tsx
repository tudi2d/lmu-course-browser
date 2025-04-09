import { Link } from "react-router-dom";

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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
