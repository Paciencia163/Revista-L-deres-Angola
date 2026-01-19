import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Search, Grid3x3, List } from "lucide-react";
import { Input } from "@/components/ui/input";

const GET_CATEGORIES_AND_ARTICLES = gql`
  query GetCategoriesAndArticles {
    sections {
      id
      name
      slug
      description
    }
    articles {
      id
      title
      excerpt
      author {
        name
      }
      section {
        id
        name
      }
      edition {
        coverImage
      }
      status
      createdAt
    }
  }
`;

interface Section {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
  };
  section: {
    id: string;
    name: string;
  };
  edition?: {
    coverImage: string;
  };
  status: string;
  createdAt: string;
}

export const CategoryBrowser = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, loading } = useQuery<{ sections: Section[]; articles: Article[] }>(
    GET_CATEGORIES_AND_ARTICLES
  );

  const sections = data?.sections || [];
  const allArticles = data?.articles || [];
  const publishedArticles = allArticles.filter(
    (a) => a && (a.status === "published" || a.status === "featured" || !a.status)
  );

  // Filter articles by selected category and search query
  const filteredArticles = publishedArticles.filter((article) => {
    const matchesCategory = !selectedCategory || article.section?.id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Count articles per category
  const categoryCounts = sections.map((section) => ({
    ...section,
    count: publishedArticles.filter((a) => a.section?.id === section.id).length,
  }));

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("pt-AO", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="body-text animate-pulse">Carregando categorias...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="category-tag">Explorar</span>
          <h2 className="section-title mt-2">Navegar por Categoria</h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Descubra conteúdos organizados por temas relevantes para o seu desenvolvimento
          </p>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          <div className="flex gap-2 border border-border rounded-lg p-1 bg-card">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2.5 rounded-full font-sans text-sm uppercase tracking-wider transition-all duration-300 ${
              !selectedCategory
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-card border border-border text-foreground hover:border-primary/50"
            }`}
          >
            Todas ({publishedArticles.length})
          </button>
          {categoryCounts.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-sans text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Articles Display */}
        {filteredArticles.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4 max-w-4xl mx-auto"
            }
          >
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate(`/artigo/${article.id}`)}
                className={`group cursor-pointer border border-border rounded-lg hover:border-primary/30 transition-all duration-300 bg-card overflow-hidden ${
                  viewMode === "list" ? "flex gap-6" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden bg-muted ${
                    viewMode === "grid" ? "aspect-[16/10]" : "w-48 h-32 flex-shrink-0"
                  }`}
                >
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

                {/* Content */}
                <div className={`flex flex-col ${viewMode === "grid" ? "p-5" : "p-4 flex-grow"}`}>
                  <h3
                    className={`article-title group-hover:text-primary transition-colors ${
                      viewMode === "grid" ? "text-base line-clamp-2" : "text-lg line-clamp-1"
                    }`}
                  >
                    {article.title}
                  </h3>
                  <p
                    className={`body-text mt-2 ${
                      viewMode === "grid" ? "text-xs line-clamp-2" : "text-sm line-clamp-2"
                    }`}
                  >
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/30">
                    <span className="text-[10px] text-muted-foreground truncate">
                      {article.author?.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-primary/30 flex-shrink-0" />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="body-text">
              Tente ajustar os filtros ou a pesquisa para encontrar o conteúdo desejado
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
