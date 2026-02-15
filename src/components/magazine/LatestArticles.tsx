import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Clock } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author_name: string;
  published_at: string | null;
  cover_image_url: string | null;
  categories: { name: string; slug: string } | null;
}

export const LatestArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles" as any)
      .select("id, title, slug, excerpt, author_name, published_at, cover_image_url, categories(name, slug)")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(4, 9)
      .then(({ data }) => {
        if (data) setArticles(data as any);
      });
  }, []);

  if (articles.length === 0) return null;

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("pt-PT", { day: "numeric", month: "short" }) : "";

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="category-tag">Recentes</span>
            <h2 className="section-title mt-2">Últimos Artigos</h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link to={`/artigo/${article.slug}`} key={article.id}>
              <article className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_15px_50px_-15px_hsl(43_74%_49%/0.15)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {article.cover_image_url ? (
                    <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                      <span className="text-5xl font-serif text-primary/10 font-bold">{article.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="category-tag">{article.categories?.name || "Artigo"}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.published_at)}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="body-text text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{article.author_name.charAt(0)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{article.author_name}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
