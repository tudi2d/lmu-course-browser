import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "../components/Footer";

const Legal = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/" className="flex items-center">
                <ChevronLeft size={16} className="mr-1" />
                Zurück zu den Kursen
              </Link>
            </Button>

            <h1 className="text-3xl font-bold mb-6 font-serif text-primary">
              Rechtliche Informationen
            </h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-3">Impressum</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Information according to § 5 TMG</p>
                <p>Philipp Hugenroth</p>
                <p>Viktor-Scheffel-Str. 16</p>
                <p>80803 Munich, Germany</p>
                <p className="pt-2">Contact</p>
                <p>Phone: +49 151 254 04273</p>
                <p>E-Mail: philipp.hugenroth@campus.lmu.de</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                Rechtliche Verantwortung
              </h2>
              <p className="text-muted-foreground">
                Diese Website wird betrieben von der
                Ludwig-Maximilians-Universität München, einer Körperschaft des
                öffentlichen Rechts, vertreten durch den Präsidenten.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Datenschutz</h2>
              <p className="text-muted-foreground">
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
                behandeln Ihre persönlichen Daten vertraulich und in
                Übereinstimmung mit den gesetzlichen Datenschutzbestimmungen und
                dieser Datenschutzerklärung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                Disclaimer: Liability for contents
              </h2>
              <p className="text-muted-foreground">
                The contents of our pages were created with care. However, we
                cannot guarantee the correctness, completeness and
                up-to-dateness of the contents. As a service provider, we are
                responsible for our own content on these pages in accordance
                with general legislation pursuant to § 7 Para.1 TMG. However,
                according to §§ 8 to 10 TMG, we are not obliged as a service
                provider to monitor transmitted or stored third-party
                information or to investigate circumstances that indicate
                illegal activity. Obligations to remove or block the use of
                information in accordance with general laws remain unaffected by
                this. However, liability in this respect is only possible from
                the point in time at which a concrete infringement of the law
                becomes known. If we become aware of any such infringements, we
                will remove this content immediately.
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
