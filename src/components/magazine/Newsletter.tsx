import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, gql } from "@apollo/client";

const GET_STATS = gql`
  query GetStats {
    articles {
      id
    }
    editions {
      id
    }
  }
`;

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { data } = useQuery(GET_STATS);

  const articlesCount = data?.articles?.length || 0;
  const editionsCount = data?.editions?.length || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscrição confirmada!",
        description: "Irá receber a nossa newsletter em breve.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-8 animate-glow">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <span className="category-tag">Newsletter</span>
          <h2 className="section-title mt-3">
            Fique a Par das Últimas Tendências
          </h2>
          <p className="body-text mt-4 max-w-2xl mx-auto text-lg">
            Receba semanalmente os melhores artigos sobre liderança, negócios e inovação
            directamente na sua caixa de entrada.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduza o seu email"
                  required
                  className="w-full h-14 px-6 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Button type="submit" variant="premium" size="xl" className="shrink-0">
                Subscrever
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Ao subscrever, concorda com a nossa política de privacidade.
              Pode cancelar a qualquer momento.
            </p>
          </form>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "25K+", label: "Subscritores" },
              { value: `${articlesCount}+`, label: "Artigos" },
              { value: `${editionsCount}+`, label: "Edições" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-serif font-bold text-gradient-gold">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
