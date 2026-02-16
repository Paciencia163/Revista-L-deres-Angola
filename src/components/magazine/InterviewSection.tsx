import { Quote, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Interview {
  id: string;
  title: string;
  interviewee_name: string;
  interviewee_role: string | null;
  interviewee_photo_url: string | null;
  quote: string | null;
  video_url: string | null;
  video_duration: string | null;
  tags: string[];
}

const fallback: Interview = {
  id: "0",
  title: "Angola tem o potencial de ser líder em tecnologia em África",
  interviewee_name: "José Massano",
  interviewee_role: "Governador do Banco Nacional de Angola",
  interviewee_photo_url: null,
  quote: "Estamos a assistir a uma transformação sem precedentes. Os jovens angolanos estão a criar soluções inovadoras que rivalizam com as melhores do mundo. A nossa missão é apoiar este ecossistema e garantir que Angola se posiciona como um hub de inovação no continente.",
  video_url: null,
  video_duration: "15:32",
  tags: ["Finanças", "Inovação"],
};

export const InterviewSection = () => {
  const [interview, setInterview] = useState<Interview>(fallback);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('interviews' as any)
        .select('*')
        .eq('is_published', true)
        .order('display_order')
        .limit(1);
      if (data && (data as any[]).length > 0) {
        setInterview(data[0] as any as Interview);
      }
    };
    fetch();
  }, []);

  const initials = interview.interviewee_name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleVideoClick = () => {
    if (interview.video_url) {
      window.open(interview.video_url, '_blank');
    }
  };

  return (
    <section id="entrevistas" className="py-20 lg:py-32 bg-muted relative overflow-hidden">
      <div className="absolute top-20 left-10 w-40 h-40 border border-primary/10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-60 h-60 border border-primary/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/5 rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="category-tag">Entrevista Exclusiva</span>
            <h2 className="section-title mt-3">
              "{interview.title}"
            </h2>

            <div className="mt-8 space-y-6">
              {interview.quote && (
                <div className="relative pl-8 border-l-2 border-primary/30">
                  <Quote className="absolute -left-4 -top-1 w-8 h-8 text-primary/30" />
                  <p className="body-text text-lg italic">
                    "{interview.quote}"
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {interview.interviewee_photo_url ? (
                  <img
                    src={interview.interviewee_photo_url}
                    alt={interview.interviewee_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                    <span className="text-xl font-serif font-bold text-primary-foreground">{initials}</span>
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-semibold text-lg text-foreground">{interview.interviewee_name}</h4>
                  {interview.interviewee_role && (
                    <p className="text-sm text-muted-foreground">{interview.interviewee_role}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg">
                Ler Entrevista Completa
              </Button>
              {interview.video_url && (
                <Button variant="elegant" size="lg" className="flex items-center gap-2" onClick={handleVideoClick}>
                  <Play className="w-4 h-4" />
                  Ver Vídeo
                </Button>
              )}
            </div>
          </div>

          {/* Visual Element */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse" />
              <div className="absolute inset-8 border border-primary/10 rounded-full" />
              <div className="absolute inset-16 border border-primary/30 rounded-full" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <button
                    onClick={handleVideoClick}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center mx-auto shadow-[0_0_60px_hsl(43_74%_49%/0.4)] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-12 h-12 text-primary-foreground ml-2" />
                  </button>
                  <p className="mt-6 text-sm uppercase tracking-wider text-muted-foreground">
                    Vídeo Exclusivo
                  </p>
                  {interview.video_duration && (
                    <p className="text-lg font-serif text-foreground mt-1">{interview.video_duration}</p>
                  )}
                </div>
              </div>

              {/* Floating tags */}
              {(interview.tags || []).slice(0, 2).map((tag, idx) => (
                <div
                  key={tag}
                  className={`absolute bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-lg animate-float ${idx === 0 ? 'top-10 right-0' : 'bottom-20 left-0'}`}
                  style={{ animationDelay: `${idx}s` }}
                >
                  <span className="text-xs text-primary uppercase tracking-wider">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
