import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/magazine/Header";
import { Footer } from "@/components/magazine/Footer";
import { motion } from "framer-motion";
import { Users, Filter, Search } from "lucide-react";

const Leaders = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<string[]>([]);
  const [activeSector, setActiveSector] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("leader_profiles" as any)
      .select("*")
      .eq("is_published", true)
      .order("display_order")
      .then(({ data }) => {
        const items = (data as any[]) || [];
        setLeaders(items);
        const uniqueSectors = [...new Set(items.map((l: any) => l.sector))].sort();
        setSectors(uniqueSectors);
        setLoading(false);
      });
  }, []);

  const filtered = leaders.filter((l) => {
    const matchesSector = activeSector === "all" || l.sector === activeSector;
    const matchesSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.role.toLowerCase().includes(search.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 rounded-full mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-sans">
                Líderes que Inspiram
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Todos os <span className="text-primary">Líderes</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça os executivos, empreendedores e visionários que estão a transformar Angola.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <button
                onClick={() => setActiveSector("all")}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeSector === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSector(s)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeSector === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar líder..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-primary animate-pulse">A carregar...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Nenhum líder encontrado.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/lider/${leader.id}`}
                    className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      {leader.photo_url ? (
                        <img
                          src={leader.photo_url}
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs uppercase tracking-wider text-primary font-sans">
                        {leader.sector}
                      </span>
                      <h3 className="text-lg font-serif font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                        {leader.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{leader.role}</p>
                      {leader.quote && (
                        <p className="text-xs text-muted-foreground italic mt-3 line-clamp-2">
                          "{leader.quote}"
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leaders;
