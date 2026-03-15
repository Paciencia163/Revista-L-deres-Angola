
CREATE TABLE public.magazine_cover (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cover_image_url text,
  cover_title text NOT NULL DEFAULT 'A Visão de um Líder',
  cover_subtitle text DEFAULT 'Estratégias para o crescimento económico sustentável',
  edition_label text DEFAULT 'Edição Fevereiro 2026',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.magazine_cover ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cover" ON public.magazine_cover FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can read active cover" ON public.magazine_cover FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));
