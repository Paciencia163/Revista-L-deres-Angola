import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author_name: string;
  published_at: string | null;
  cover_image_url: string | null;
  is_featured: boolean | null;
  categories: { name: string } | null;
}

export const FeaturedArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles" as any)
      .select("id, title, slug, excerpt, author_name, published_at, cover_image_url, is_featured, categories(name)")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setArticles(data as any);
      });
  }, []);

  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1);
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <section id="negocios" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="category-tag">Destaque</span>
            <h2 className="section-title mt-2">Artigos em Destaque</h2>
          </div>
          <Link to="/categoria/todos" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group">
            <span className="font-sans text-sm uppercase tracking-wider">Ver Todos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            <Link to={`/artigo/${mainArticle.slug}`}>
              <article className="group cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-[16/9] lg:aspect-[16/10]">
                  {mainArticle.cover_image_url ? (
                    <img src={mainArticle.cover_image_url} alt={mainArticle.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                    <span className="category-tag">{mainArticle.categories?.name || "Artigo"}</span>
                    <h3 className="article-title text-2xl lg:text-3xl mt-3 text-foreground group-hover:text-primary">{mainArticle.title}</h3>
                    <p className="body-text mt-3 line-clamp-2 lg:line-clamp-3">{mainArticle.excerpt}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-sm text-foreground">{mainArticle.author_name}</span>
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{formatDate(mainArticle.published_at)}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-6">
            {sideArticles.map((article) => (
              <Link to={`/artigo/${article.slug}`} key={article.id}>
                <article className="group cursor-pointer p-6 border border-border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_74%_49%/0.1)] mb-6 last:mb-0">
                  {article.cover_image_url && (
                    <img src={article.cover_image_url} alt={article.title} className="w-full h-32 object-cover rounded mb-3" />
                  )}
                  <span className="category-tag">{article.categories?.name || "Artigo"}</span>
                  <h3 className="article-title text-lg mt-2">{article.title}</h3>
                  <p className="body-text text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs text-foreground">{article.author_name}</span>
                    <span className="w-1 h-1 rounded-full bg-primary/50" />
                    <span className="text-xs text-muted-foreground">{formatDate(article.published_at)}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
