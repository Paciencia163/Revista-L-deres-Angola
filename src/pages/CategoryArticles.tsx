import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/magazine/Header";
import { Footer } from "@/components/magazine/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";

const CategoryArticles = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  const fetchData = async () => {
    const { data: cat } = await supabase
      .from('categories' as any)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (cat) {
      setCategory(cat);
      const { data: arts } = await supabase
        .from('articles' as any)
        .select('*')
        .eq('category_id', (cat as any).id)
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (arts) setArticles(arts as any[]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <span className="category-tag" style={{ color: category?.color }}>Categoria</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-2">{category?.name || "..."}</h1>
            {category?.description && <p className="body-text mt-3">{category.description}</p>}
          </motion.div>

          {loading ? (
            <div className="text-center text-primary animate-pulse py-20">A carregar...</div>
          ) : articles.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">Nenhum artigo nesta categoria ainda.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/artigo/${article.slug}`} className="group block">
                    <article className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_20px_60px_-20px_hsl(43_74%_49%/0.15)]">
                      {article.cover_image_url && (
                        <img src={article.cover_image_url} alt={article.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                        {article.excerpt && <p className="body-text text-sm mt-2 line-clamp-2">{article.excerpt}</p>}
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author_name}</span>
                          {article.published_at && (
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.published_at).toLocaleDateString('pt-PT')}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryArticles;
