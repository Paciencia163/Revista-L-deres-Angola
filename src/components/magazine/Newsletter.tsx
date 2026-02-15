import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    
    const { error } = await supabase.from("subscribers" as any).insert({ email } as any);
    
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Já subscrito!", description: "Este email já está na nossa lista." });
      } else {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Subscrição confirmada!", description: "Irá receber a nossa newsletter em breve." });
    }
    
    setEmail("");
    setSubmitting(false);
  };

  return (
    <section id="newsletter" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-8 animate-glow">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <span className="category-tag">Newsletter</span>
          <h2 className="section-title mt-3">Fique a Par das Últimas Tendências</h2>
          <p className="body-text mt-4 max-w-2xl mx-auto text-lg">
            Receba semanalmente os melhores artigos sobre liderança, negócios e inovação
            directamente na sua caixa de entrada.
          </p>
          <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Introduza o seu email"
                  required
                  className="w-full h-14 px-6 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Button type="submit" variant="premium" size="xl" className="shrink-0" disabled={submitting}>
                {submitting ? "A subscrever..." : "Subscrever"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Ao subscrever, concorda com a nossa política de privacidade. Pode cancelar a qualquer momento.
            </p>
          </form>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "25K+", label: "Subscritores" },
              { value: "500+", label: "Artigos" },
              { value: "50+", label: "Edições" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-serif font-bold text-gradient-gold">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
