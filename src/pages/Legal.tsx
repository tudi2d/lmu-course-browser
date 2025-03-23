
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Footer from '../components/Footer';

const Legal = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/" className="flex items-center">
                <ChevronLeft size={16} className="mr-1" />
                Back to courses
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-6 font-serif text-primary">Legal Information</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-3">Impressum</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Ludwig-Maximilians-Universität München</p>
                <p>Geschwister-Scholl-Platz 1</p>
                <p>80539 München</p>
                <p>Germany</p>
                <p className="pt-2">Phone: +49 (0) 89 / 2180 - 0</p>
                <p>Email: info@lmu.de</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">Legal Responsibility</h2>
              <p className="text-muted-foreground">
                This website is operated by Ludwig-Maximilians-Universität München, 
                a corporation under public law represented by the President.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">Privacy Policy</h2>
              <p className="text-muted-foreground">
                We take the protection of your personal data very seriously. We treat your personal 
                data confidentially and in accordance with the statutory data protection regulations 
                and this privacy policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">Disclaimer</h2>
              <p className="text-muted-foreground">
                The information provided on this website has been compiled with care. 
                However, errors in content cannot be ruled out. In particular, no guarantee 
                is given for the completeness, correctness and up-to-dateness of the information.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Legal;
