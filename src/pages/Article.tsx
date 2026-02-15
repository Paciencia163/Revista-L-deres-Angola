import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/magazine/Header";
import { Footer } from "@/components/magazine/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Article = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    const { data } = await supabase
      .from('articles' as any)
      .select('*, categories(name, slug, color)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    const articleData = data as any;
    if (articleData) {
      setArticle(articleData);
      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments' as any)
        .select('*')
        .eq('article_id', articleData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (commentsData) setComments(commentsData as any[]);

      // Related articles
      if (articleData.category_id) {
        const { data: related } = await supabase
          .from('articles' as any)
          .select('*, categories(name)')
          .eq('category_id', articleData.category_id)
          .eq('is_published', true)
          .neq('id', articleData.id)
          .limit(3);
        if (related) setRelatedArticles(related as any[]);
      }
    }
    setLoading(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentContent || !article) return;
    const { error } = await supabase.from('comments' as any).insert({
      article_id: article.id,
      author_name: commentName,
      content: commentContent,
    } as any);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Comentário enviado!", description: "O seu comentário será publicado após aprovação." });
      setCommentName("");
      setCommentContent("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse text-xl font-serif">A carregar artigo...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-serif text-foreground mb-4">Artigo não encontrado</h1>
          <Link to="/"><Button variant="gold">Voltar ao Início</Button></Link>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {article.cover_image_url && (
            <div className="h-[50vh] relative overflow-hidden">
              <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          )}

          <div className="container mx-auto px-4 relative z-10" style={{ marginTop: article.cover_image_url ? "-120px" : "40px" }}>
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm mb-6">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>

            {article.categories && (
              <span className="category-tag" style={{ color: article.categories.color }}>{article.categories.name}</span>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mt-3 leading-tight"
            >
              {article.title}
            </motion.h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground mt-4 max-w-3xl">{article.excerpt}</p>
            )}

            <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.author_name}</span>
              {article.published_at && (
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(article.published_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              )}
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {comments.length} comentários</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6 [&_h2]:text-foreground [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:font-serif [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-foreground">
              {article.content?.split('\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Divider */}
            <div className="my-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Comments */}
            <section>
              <h3 className="text-2xl font-serif text-foreground mb-8 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                Comentários ({comments.length})
              </h3>

              {/* Comment form */}
              <form onSubmit={handleComment} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
                <input
                  placeholder="O seu nome"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                  className="w-full h-12 px-4 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  placeholder="Escreva o seu comentário..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                />
                <Button type="submit" variant="gold" size="sm">
                  <Send className="w-4 h-4 mr-2" /> Enviar Comentário
                </Button>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="border-l-2 border-primary/20 pl-6 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {c.author_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-foreground">{c.author_name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.content}</p>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-muted-foreground text-center py-8">Seja o primeiro a comentar!</p>}
              </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-16">
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <h3 className="text-2xl font-serif text-foreground mb-6">Artigos Relacionados</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedArticles.map((ra) => (
                    <Link key={ra.id} to={`/artigo/${ra.slug}`} className="group bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all">
                      <span className="category-tag text-xs">{ra.categories?.name}</span>
                      <h4 className="font-serif font-medium text-foreground mt-2 group-hover:text-primary transition-colors">{ra.title}</h4>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
};

export default Article;
