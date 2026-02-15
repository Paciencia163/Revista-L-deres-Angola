import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Líderes", href: "/#lideres" },
  { label: "Negócios", href: "/#negocios" },
  { label: "Entrevistas", href: "/#entrevistas" },
  { label: "Edições", href: "/edicoes" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-sans">Revista</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-gradient-gold">Líderes Angola</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              item.href.startsWith('/#') ? (
                <a key={item.label} href={item.href} className="text-sm font-sans uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300">{item.label}</a>
              ) : (
                <Link key={item.label} to={item.href} className="text-sm font-sans uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300">{item.label}</Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition-colors"><Search className="w-5 h-5" /></button>
            <Button variant="gold" size="sm" className="hidden md:flex" asChild><a href="/#newsletter">Subscrever</a></Button>
            <button className="lg:hidden text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                item.href.startsWith('/#') ? (
                  <a key={item.label} href={item.href} className="text-lg font-sans text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>{item.label}</a>
                ) : (
                  <Link key={item.label} to={item.href} className="text-lg font-sans text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>
                )
              ))}
              <Button variant="gold" className="mt-4 w-full" asChild><a href="/#newsletter" onClick={() => setIsMenuOpen(false)}>Subscrever</a></Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
