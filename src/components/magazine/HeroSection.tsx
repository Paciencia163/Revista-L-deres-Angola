import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import leaderPortrait from "@/assets/leader-portrait.jpg";

interface FeaturedArticle {
  title: string;
  slug: string;
  categories: { name: string } | null;
}

export const HeroSection = () => {
  const [headlines, setHeadlines] = useState<FeaturedArticle[]>([]);

  useEffect(() => {
    supabase
      .from("articles" as any)
      .select("title, slug, categories(name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) setHeadlines(data as any);
      });
  }, []);

  const staticHeadlines = [
    { title: "O Futuro da Banca Angolana", slug: "#", categories: { name: "Finanças" } },
    { title: "Startups que Transformam", slug: "#", categories: { name: "Tecnologia" } },
    { title: "Liderança Feminina em Alta", slug: "#", categories: { name: "Gestão" } },
    { title: "Investir em 2025", slug: "#", categories: { name: "Mercados" } },
  ];

  const displayHeadlines = headlines.length > 0 ? headlines : staticHeadlines;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(43 74% 49%) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-primary/30 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-glow" />
                <span className="category-tag">Edição Fevereiro 2026</span>
              </div>
              <h1 className="magazine-title leading-tight">
                Líderes<br /><span className="text-foreground">Angola</span>
              </h1>
              <p className="body-text text-lg max-w-xl mx-auto lg:mx-0">
                A revista de referência para executivos, empreendedores e jovens líderes.
                Histórias inspiradoras, estratégias de sucesso e visões do futuro de Angola.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="premium" size="xl" asChild>
                  <a href="#negocios">Ler Agora <ChevronRight className="w-5 h-5" /></a>
                </Button>
                <Button variant="elegant" size="xl" asChild>
                  <Link to="/edicoes">Edições Anteriores</Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              {displayHeadlines.map((item, index) => (
                <Link
                  to={item.slug === "#" ? "#" : `/artigo/${item.slug}`}
                  key={index}
                  className="text-left p-4 border-l-2 border-primary/30 hover:border-primary transition-colors duration-300 group cursor-pointer"
                >
                  <span className="category-tag text-xs">{item.categories?.name || "Artigo"}</span>
                  <p className="text-sm text-foreground mt-1 group-hover:text-primary transition-colors">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative opacity-0 animate-fade-in-right" style={{ animationDelay: "0.4s" }}>
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="absolute -inset-4 border border-primary/20 rounded-lg" />
              <div className="absolute -inset-8 border border-primary/10 rounded-lg hidden lg:block" />
              <div className="relative overflow-hidden rounded-lg shadow-[0_25px_80px_-20px_hsl(43_74%_49%/0.3)]">
                <img src={leaderPortrait} alt="Líder Empresarial Angolano" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <span className="category-tag">Capa</span>
                  <h2 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mt-2">A Visão de um Líder</h2>
                  <p className="text-muted-foreground mt-2">Estratégias para o crescimento económico sustentável</p>
                </div>
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
