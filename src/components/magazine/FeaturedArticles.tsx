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
  // Filter published articles and sort them or follow some logic
  const publishedArticles = allArticles.filter(a => a && (a.status === 'published' || a.status === 'featured' || !a.status));
  
  // Use featured articles for carousel, others for side list
  const featuredArticles = publishedArticles.filter(a => a?.isFeatured);
  
  if (publishedArticles.length === 0) return null;

  // Let's use up to 3 for carousel, and the rest for side
  const carouselArticles = featuredArticles.length > 0 ? featuredArticles.slice(0, 3) : publishedArticles.slice(0, 1);
  const carouselIds = new Set(carouselArticles.map(a => a.id));
  const sideArticles = publishedArticles.filter(a => !carouselIds.has(a.id)).slice(0, 3);

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
            href="#"
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="font-sans text-sm uppercase tracking-wider">Ver Todos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Articles Grid with Carousel */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Featured Carousel */}
          <div className="lg:col-span-2">
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-full">
                {carouselArticles.map((article) => (
                  <CarouselItem key={article.id} className="h-full">
                    <article 
                      className="group cursor-pointer h-full"
                      onClick={() => navigate(`/artigo/${article.id}`)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[16/9] lg:aspect-[16/10] h-full">
                        {article.edition?.coverImage ? (
                          <img 
                            src={article.edition.coverImage} 
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-9xl font-serif text-primary/10 font-bold select-none">
                                L
                              </div>
                            </div>
                          </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                          <span className="category-tag">{article.section?.name || "Geral"}</span>
                          <h3 className="article-title text-2xl lg:text-3xl mt-3 text-foreground group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="body-text mt-3 line-clamp-2 lg:line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-4 mt-4">
                            <span className="text-sm text-foreground">{article.author?.name}</span>
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            <span className="text-sm text-muted-foreground">{formatDate(article.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {carouselArticles.length > 1 && (
                <div className="absolute bottom-6 right-20 flex gap-2">
                  <CarouselPrevious className="relative left-0 translate-y-0 border-primary/30 hover:bg-primary/10" />
                  <CarouselNext className="relative right-0 translate-y-0 border-primary/30 hover:bg-primary/10" />
                </div>
              )}
            </Carousel>
          </div>

          {/* Side Articles */}
          <div className="space-y-6">
            {sideArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate(`/artigo/${article.id}`)}
                className="group cursor-pointer p-6 border border-border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_74%_49%/0.1)]"
              >
                <span className="category-tag">{article.section?.name || "Geral"}</span>
                <h3 className="article-title text-lg mt-2">{article.title}</h3>
                <p className="body-text text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs text-foreground">{article.author?.name}</span>
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  <span className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <a
          href="#"
          className="flex md:hidden items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors mt-8"
        >
          <span className="font-sans text-sm uppercase tracking-wider">Ver Todos os Artigos</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
