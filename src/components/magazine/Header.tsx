import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, gql } from "@apollo/client";

const GET_SECTIONS = gql`
  query GetSections {
    sections {
      id
      name
      slug
    }
  }
`;

interface Section {
  id: string;
  name: string;
  slug: string;
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useQuery<{ sections: Section[] }>(GET_SECTIONS);

  const sections = data?.sections || [];
  
  const navItems = [
    { label: "Início", href: "#" },
    ...sections.filter(s => s && s.name).map(s => ({
      label: s.name,
      href: `#${s.slug || s.id}`
    }))
  ];

  // Fallback if no sections loaded yet
  const displayItems = navItems.length > 1 ? navItems : [
    { label: "Início", href: "#" },
    { label: "Líderes", href: "#lideres" },
    { label: "Negócios", href: "#negocios" },
    { label: "Inovação", href: "#inovacao" },
    { label: "Entrevistas", href: "#entrevistas" },
    { label: "Opinião", href: "#opiniao" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-sans">
              Revista
            </span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-gradient-gold">
              Líderes Angola
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {displayItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-sans uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Button variant="gold" size="sm" className="hidden md:flex">
              Subscrever
            </Button>
            <button
              className="lg:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {displayItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-lg font-sans text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button variant="gold" className="mt-4 w-full">
                Subscrever
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
