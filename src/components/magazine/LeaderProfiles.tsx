import { ArrowUpRight } from "lucide-react";
import { useQuery, gql } from "@apollo/client";

const GET_LEADERS = gql`
  query GetUsersByRole($role: String!) {
    usersByRole(role: $role) {
      id
      name
      role
      avatar
    }
  }
`;

interface Leader {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export const LeaderProfiles = () => {
  const { data } = useQuery<{ usersByRole: Leader[] }>(GET_LEADERS, {
    variables: { role: 'writer' } // Or another role that makes sense for "Leaders"
  });

  const leadersFromApi = data?.usersByRole || [];

  const defaultLeaders = [
    {
      id: "1",
      name: "Isabel dos Santos",
      role: "Empresária",
      sector: "Investimentos",
      quote: "O futuro de África passa pela educação e inovação tecnológica.",
    },
    {
      id: "2",
      name: "Carlos Saturnino",
      role: "CEO",
      sector: "Energia",
      quote: "A transição energética é uma oportunidade única para Angola.",
    },
    {
      id: "3",
      name: "Mário Palhares",
      role: "Fundador",
      sector: "Tecnologia",
      quote: "As startups angolanas estão prontas para competir globalmente.",
    },
    {
      id: "4",
      name: "Teresa Fernandes",
      role: "Directora",
      sector: "Finanças",
      quote: "A inclusão financeira é a chave para o desenvolvimento sustentável.",
    },
  ];

  const displayLeaders = leadersFromApi.length > 0 
    ? leadersFromApi.filter(l => l !== null).map(l => ({
        id: l.id,
        name: l.name || "Anónimo",
        role: l.role || "Líder",
        sector: "Liderança", 
        quote: "Líder em destaque na nossa plataforma."
      }))
    : defaultLeaders;

  return (
    <section id="lideres" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="category-tag">Perfis</span>
          <h2 className="section-title mt-2">Líderes que Inspiram</h2>
          <p className="body-text mt-4 max-w-2xl mx-auto">
            Conheça as personalidades que estão a transformar o panorama empresarial angolano
            com visão, inovação e determinação.
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayLeaders.map((leader, index) => (
            <article
              key={leader.id}
              className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_hsl(43_74%_49%/0.2)] cursor-pointer opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Number indicator */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl font-serif font-bold text-primary">
                  {leader.name.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <span className="category-tag text-xs">{leader.sector}</span>
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {leader.name}
                </h3>
                <p className="text-sm text-muted-foreground">{leader.role}</p>
              </div>

              {/* Quote */}
              <blockquote className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{leader.quote}"
                </p>
              </blockquote>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>
            </article>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="font-sans text-sm uppercase tracking-wider border-b border-primary/30 group-hover:border-primary pb-1">
              Ver Todos os Perfis
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
