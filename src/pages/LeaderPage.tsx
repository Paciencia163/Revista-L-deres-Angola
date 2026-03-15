import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/magazine/Header";
import { Footer } from "@/components/magazine/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Quote, Clock, ArrowRight } from "lucide-react";
import { SocialShare } from "@/components/magazine/SocialShare";

interface Leader {
  id: string;
  name: string;
  role: string;
  sector: string;
  quote: string | null;
  bio: string | null;
  photo_url: string | null;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  categories: { name: string } | null;
}

const LeaderPage = () => {
  const { id } = useParams<{ id: string }>();
  const [leader, setLeader] = useState<Leader | null>(null);
  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const [otherLeaders, setOtherLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const { data: l } = await (supabase as any)
        .from("leader_profiles")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();
      setLeader(l);

      // Related articles: search by leader name in content/title
      if (l) {
        const firstName = l.name.split(" ")[0];
        const { data: arts } = await (supabase as any)
          .from("articles")
          .select("id, title, slug, excerpt, cover_image_url, published_at, categories(name)")
          .eq("is_published", true)
          .or(`title.ilike.%${firstName}%,content.ilike.%${firstName}%`)
          .order("published_at", { ascending: false })
          .limit(6);
        if (arts) setArticles(arts);

        // Other leaders
        const { data: others } = await (supabase as any)
          .from("leader_profiles")
          .select("id, name, role, sector, photo_url, quote, bio")
          .eq("is_published", true)
          .neq("id", id)
          .order("display_order")
          .limit(4);
        if (others) setOtherLeaders(others);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" }) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center text-muted-foreground">A carregar...</div>
        <Footer />
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Perfil não encontrado</h1>
          <Link to="/#lideres" className="text-primary hover:underline">Voltar aos líderes</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <Link to="/#lideres" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">Líderes que Inspiram</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="category-tag mb-4 inline-block">{leader.sector}</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                  {leader.name}
                </h1>
                <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-lg">{leader.role}</span>
                </div>

                {leader.quote && (
                  <motion.blockquote
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
                    className="mt-8 pl-6 border-l-2 border-primary"
                  >
                    <Quote className="w-6 h-6 text-primary/40 mb-2" />
                    <p className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed">
                      "{leader.quote}"
                    </p>
                  </motion.blockquote>
                )}

                <SocialShare title={leader.name} className="mt-8" />
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                {leader.photo_url ? (
                  <div className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-2xl">
                    <img src={leader.photo_url} alt={leader.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="rounded-lg aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-2xl">
                    <span className="text-8xl font-serif font-bold text-primary/30">{leader.name.charAt(0)}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bio */}
        {leader.bio && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                <h2 className="section-title mb-8">Biografia</h2>
                <div className="prose prose-lg max-w-none">
                  {leader.bio.split("\n").map((p, i) => (
                    <p key={i} className="body-text text-lg leading-relaxed mb-6">{p}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Related articles */}
        {articles.length > 0 && (
          <section className="py-16 lg:py-24 bg-card/50">
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <span className="category-tag">Artigos</span>
                <h2 className="section-title mt-2">Artigos Relacionados</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, i) => (
                  <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Link to={`/artigo/${article.slug}`}>
                      <article className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_15px_50px_-15px_hsl(43_74%_49%/0.15)]">
                        <div className="aspect-[16/9] overflow-hidden bg-muted">
                          {article.cover_image_url ? (
                            <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                              <span className="text-4xl font-serif text-primary/10 font-bold">{article.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="category-tag">{article.categories?.name || "Artigo"}</span>
                            {article.published_at && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(article.published_at)}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                          {article.excerpt && <p className="body-text text-sm mt-2 line-clamp-2">{article.excerpt}</p>}
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other leaders */}
        {otherLeaders.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <span className="category-tag">Descubra</span>
                <h2 className="section-title mt-2">Outros Líderes</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherLeaders.map((other) => (
                  <Link key={other.id} to={`/lider/${other.id}`}>
                    <article className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-500">
                      {other.photo_url ? (
                        <div className="w-full h-40 overflow-hidden">
                          <img src={other.photo_url} alt={other.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-4xl font-serif font-bold text-primary/30">{other.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="p-4">
                        <span className="category-tag text-xs">{other.sector}</span>
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mt-1">{other.name}</h3>
                        <p className="text-sm text-muted-foreground">{other.role}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LeaderPage;
