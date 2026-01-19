import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      excerpt
      status
      isFeatured
      author {
        name
      }
      section {
        name
      }
      edition {
        coverImage
      }
      createdAt
    }
  }
`;

interface Article {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  isFeatured: boolean;
  author: {
    name: string;
  };
  section: {
    name: string;
  };
  edition?: {
    coverImage: string;
  };
  createdAt: string;
}

export const FeaturedArticles = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<{ articles: Article[] }>(GET_ARTICLES);

  if (loading) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="body-text animate-pulse">Carregando artigos...</p>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto px-4 py-20 text-center text-red-500">
      <p>Erro ao carregar artigos: {error.message}</p>
    </div>
  );

  const allArticles = data?.articles || [];
  // Filter published articles and sort them by date (latest first)
  const publishedArticles = [...allArticles]
    .filter(a => a && (a.status === 'published' || a.status === 'featured' || !a.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Get featured articles
  const featuredArticles = publishedArticles.filter(a => a?.isFeatured);
  
  // Use featured articles for carousel if they exist, otherwise use all published
  const carouselArticles = featuredArticles.length > 0 ? featuredArticles : publishedArticles.slice(0, 6);
  const sideArticles = publishedArticles;
  
  // If no articles, show a message
  if (publishedArticles.length === 0) {
    return (
      <section id="negocios" className="py-20 lg:py-32 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="body-text">Nenhum artigo disponível no momento.</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('pt-AO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section id="negocios" className="py-20 lg:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="category-tag">Destaque</span>
            <h2 className="section-title mt-2">Artigos em Destaque</h2>
          </div>
          <a
            href="#todos-artigos"
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="font-sans text-sm uppercase tracking-wider">Ver Todos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Featured Articles Carousel */}
        <div className="mb-20">
          <Carousel 
            className="w-full" 
            opts={{ 
              align: "start",
              loop: true 
            }}
          >
            <CarouselContent className="-ml-4">
              {carouselArticles.map((article) => (
                <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <article 
                    className="group cursor-pointer h-full border border-border rounded-lg overflow-hidden bg-card/50 hover:border-primary/50 transition-all duration-300"
                    onClick={() => navigate(`/artigo/${article.id}`)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {article.edition?.coverImage ? (
                        <img 
                          src={article.edition.coverImage} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-4xl font-serif text-primary/20">L</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="p-6">
                      <span className="category-tag text-[10px]">{article.section?.name || "Geral"}</span>
                      <h3 className="article-title text-xl mt-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="body-text mt-3 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
                        <span className="text-xs text-foreground font-medium">{article.author?.name}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            {carouselArticles.length > 1 && (
              <div className="hidden md:flex justify-end gap-2 mt-8">
                <CarouselPrevious className="static translate-y-0 border-primary/30 hover:bg-primary/10 text-primary" />
                <CarouselNext className="static translate-y-0 border-primary/30 hover:bg-primary/10 text-primary" />
              </div>
            )}
          </Carousel>
        </div>

        {/* All Articles Grid */}
        <div id="todos-artigos">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="section-title text-2xl">Todos os Artigos</h3>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sideArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate(`/artigo/${article.id}`)}
                className="group cursor-pointer border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300 bg-black/20 overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  {/* Article Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {article.edition?.coverImage ? (
                      <img 
                        src={article.edition.coverImage} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                        <span className="text-4xl font-serif text-primary/20 font-bold">L</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="category-tag text-[9px] bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
                        {article.section?.name || "Geral"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="article-title text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="body-text text-xs mt-2 line-clamp-2 flex-grow">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
                      <span className="text-[10px] text-muted-foreground truncate">{article.author?.name}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/30 flex-shrink-0" />
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <a
          href="#todos-artigos"
          className="flex md:hidden items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors mt-8"
        >
          <span className="font-sans text-sm uppercase tracking-wider">Ver Todos os Artigos</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
