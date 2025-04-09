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
                <p>Ludwig-Maximilians-Universität München</p>
                <p>Geschwister-Scholl-Platz 1</p>
                <p>80539 München</p>
                <p>Deutschland</p>
                <p className="pt-2">Telefon: +49 (0) 89 / 2180 - 0</p>
                <p>E-Mail: info@lmu.de</p>
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
              <h2 className="text-xl font-bold mb-3">Haftungsausschluss</h2>
              <p className="text-muted-foreground">
                Die auf dieser Website bereitgestellten Informationen wurden
                sorgfältig zusammengestellt. Dennoch können Fehler im Inhalt
                nicht ausgeschlossen werden. Insbesondere wird keine Garantie
                für die Vollständigkeit, Richtigkeit und Aktualität der
                Informationen übernommen.
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
