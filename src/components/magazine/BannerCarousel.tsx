import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
}

export const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from("banners" as any)
      .select("*")
      .eq("is_active", true)
      .eq("position", "homepage")
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setBanners(data as any);
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  const Wrapper = banner.link_url ? "a" : "div";
  const wrapperProps = banner.link_url ? { href: banner.link_url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg" style={{ maxHeight: 200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Wrapper {...wrapperProps} className="block">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-[200px] object-cover rounded-lg"
                />
              </Wrapper>
            </motion.div>
          </AnimatePresence>
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-foreground/30"}`}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1 uppercase tracking-wider">Publicidade</p>
      </div>
    </section>
  );
};
