import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText, Tag, Clock, X } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category_name: string | null;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const search = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data } = await (supabase as any)
      .from("articles")
      .select("id, title, slug, excerpt, cover_image_url, published_at, categories(name)")
      .eq("is_published", true)
      .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`)
      .order("published_at", { ascending: false })
      .limit(8);

    if (data) {
      setResults(
        data.map((a: any) => ({
          ...a,
          category_name: a.categories?.name || null,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  const goToArticle = (slug: string) => {
    onOpenChange(false);
    navigate(`/artigo/${slug}`);
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-card border-border overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar artigos..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-14"
            autoFocus
          />
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-muted-foreground text-sm">A pesquisar...</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum resultado para "{query}"</p>
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-8 text-center">
              <Search className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">Digite pelo menos 2 caracteres para pesquisar</p>
              <p className="text-muted-foreground/60 text-xs mt-2">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">⌘K</kbd> para abrir a pesquisa
              </p>
            </div>
          )}

          {results.map((article) => (
            <button
              key={article.id}
              onClick={() => goToArticle(article.slug)}
              className="w-full flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors text-left border-b border-border last:border-0"
            >
              {article.cover_image_url ? (
                <img
                  src={article.cover_image_url}
                  alt=""
                  className="w-16 h-12 rounded object-cover shrink-0 bg-muted"
                />
              ) : (
                <div className="w-16 h-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-medium text-foreground text-sm line-clamp-1">{article.title}</h4>
                {article.excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  {article.category_name && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-medium">
                      <Tag className="w-3 h-3" />
                      {article.category_name}
                    </span>
                  )}
                  {article.published_at && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.published_at)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
