import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/magazine/Header";
import { Footer } from "@/components/magazine/Footer";
import { motion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";

const Editions = () => {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('editions' as any)
        .select('*')
        .eq('is_published', true)
        .order('edition_number', { ascending: false });
      if (data) setEditions(data as any[]);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="category-tag">Arquivo</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mt-3">
              Edições Anteriores
            </h1>
            <p className="body-text mt-4 max-w-2xl mx-auto">
              Explore todas as edições da Revista Líderes Angola
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-primary animate-pulse py-20">A carregar...</div>
          ) : editions.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Edições em breve disponíveis.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {editions.map((edition, index) => (
                <motion.article
                  key={edition.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_hsl(43_74%_49%/0.2)]">
                    {edition.cover_image_url ? (
                      <img src={edition.cover_image_url} alt={edition.title} className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-gradient-to-br from-card to-muted flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-6xl font-serif font-bold text-primary/20">#{edition.edition_number}</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-xs uppercase tracking-widest text-primary">Edição #{edition.edition_number}</span>
                      <h3 className="text-xl font-serif font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{edition.title}</h3>
                      {edition.published_at && (
                        <span className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(edition.published_at).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Editions;
