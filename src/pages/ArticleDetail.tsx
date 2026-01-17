import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Header } from "@/components/magazine/Header";
import { Footer } from "@/components/magazine/Footer";
import { Newsletter } from "@/components/magazine/Newsletter";
import { Calendar, User, Tag, Share2, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const GET_ARTICLE_BY_ID = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      excerpt
      content
      createdAt
      views
      author {
        name
        avatar
      }
      section {
        name
      }
      edition {
        title
        coverImage
      }
    }
  }
`;

const INCREMENT_VIEWS = gql`
  mutation IncrementArticleViews($id: ID!) {
    incrementArticleViews(id: $id) {
      id
      views
    }
  }
`;

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  views: number;
  author: {
    name: string;
    avatar?: string;
  };
  section: {
    name: string;
  };
  edition?: {
    title: string;
    coverImage?: string;
  };
}

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incrementViews] = useMutation(INCREMENT_VIEWS);

  const { loading, error, data } = useQuery<{ article: Article }>(GET_ARTICLE_BY_ID, {
    variables: { id },
  });

  useEffect(() => {
    if (id) {
      incrementViews({ variables: { id } }).catch(err => 
        console.error("Erro ao incrementar visualizações:", err)
      );
    }
  }, [id, incrementViews]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-primary font-serif text-2xl">Carregando artigo...</div>
    </div>
  );

  if (error || !data?.article) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h2 className="text-2xl text-foreground mb-4">Artigo não encontrado</h2>
      <Button onClick={() => navigate("/")}>Voltar para o Início</Button>
    </div>
  );

  const { article } = data;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-AO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-wider">Voltar</span>
          </button>

          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="category-tag text-xs">{article.section.name}</span>
                {article.edition && (
                  <span className="text-xs text-muted-foreground uppercase tracking-widest border-l border-border pl-3">
                    {article.edition.title}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-8">
                {article.title}
              </h1>

              <p className="text-xl text-muted-foreground font-sans leading-relaxed mb-10 italic">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-t border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {article.author.avatar ? (
                      <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-primary">{article.author.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{article.author.name}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-tighter">Autor</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs">{formatDate(article.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs">{article.views || 0} visualizações</span>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent hover:text-primary">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Partilhar</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.edition?.coverImage && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-16 shadow-2xl">
                <img 
                  src={article.edition.coverImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-invert prose-gold max-w-none 
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed
                prose-strong:text-primary prose-blockquote:border-primary prose-blockquote:italic
                prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            <div className="mt-20 pt-10 border-t border-border flex justify-center">
               <div className="flex gap-4">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{article.section.name}</span>
               </div>
            </div>
          </article>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default ArticleDetail;
