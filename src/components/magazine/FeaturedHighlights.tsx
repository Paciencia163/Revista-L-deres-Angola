import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GET_FEATURED_ARTICLES = gql`
  query GetFeaturedHighlights {
    articles {
      id
      title
      excerpt
      author {
        name
      }
      section {
        name
      }
      edition {
        coverImage
      }
      isFeatured
      status
      createdAt
    }
  }
`;

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
  };
  section: {
    name: string;
  };
  edition?: {
    coverImage: string;
  };
  isFeatured: boolean;
  status: string;
  createdAt: string;
}

export const FeaturedHighlights = () => {
  const navigate = useNavigate();
  const { data, loading } = useQuery<{ articles: Article[] }>(GET_FEATURED_ARTICLES);

  const articles = data?.articles || [];
  const publishedArticles = articles.filter(a => a && (a.status === 'published' || a.status === 'featured' || !a.status));
  const featuredArticles = publishedArticles.filter(a => a?.isFeatured);
  
  // Get main article and secondary articles
  const mainArticle = featuredArticles[0] || publishedArticles[0];
  const secondaryArticles = featuredArticles.length > 1 
    ? featuredArticles.slice(1, 4) 
    : publishedArticles.slice(1, 4);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('pt-AO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "";
    }
  };

  if (loading || !mainArticle) return null;

  return (
    <section className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="category-tag">Edição Especial</span>
            <h2 className="section-title mt-2">Destaques da Semana</h2>
          </div>
          <button 
            onClick={() => navigate('#negocios')}
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="font-sans text-sm uppercase tracking-wider">Ver Mais</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Large Featured Article */}
          <article 
            className="lg:col-span-8 group cursor-pointer"
            onClick={() => navigate(`/artigo/${mainArticle.id}`)}
          >
            <div className="relative overflow-hidden rounded-xl bg-card h-full min-h-[500px] lg:min-h-[600px] border border-border hover:border-primary/50 transition-all duration-500">
              {mainArticle.edition?.coverImage ? (
                <img 
                  src={mainArticle.edition.coverImage} 
                  alt={mainArticle.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <div className="text-9xl font-serif text-primary/10 font-bold select-none">L</div>
                </div>
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                  <span className="category-tag bg-background/80 px-3 py-1 rounded backdrop-blur-sm">
                    {mainArticle.section?.name || "Destaque"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(mainArticle.createdAt)}
                  </span>
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                  {mainArticle.title}
                </h2>
                
                {mainArticle.excerpt && (
                  <p className="body-text text-base lg:text-lg mb-6 line-clamp-3 max-w-3xl">
                    {mainArticle.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {mainArticle.author?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {mainArticle.author?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Decorative accent */}
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-primary/50" />
            </div>
          </article>

          {/* Secondary Articles Column */}
          <div className="lg:col-span-4 space-y-6">
            {secondaryArticles.map((article, index) => (
              <article
                key={article.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/artigo/${article.id}`)}
              >
                <div className="relative overflow-hidden rounded-lg bg-card h-full min-h-[180px] border border-border hover:border-primary/50 transition-all duration-300">
                  {article.edition?.coverImage ? (
                    <img 
                      src={article.edition.coverImage} 
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                      <span className="text-5xl font-serif text-primary/10 font-bold">L</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="category-tag text-xs bg-background/70 px-2 py-0.5 rounded backdrop-blur-sm">
                        {article.section?.name || "Geral"}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.author?.name}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/30" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
