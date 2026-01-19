import { Header } from "@/components/magazine/Header";
import { HeroSection } from "@/components/magazine/HeroSection";
import { FeaturedHighlights } from "@/components/magazine/FeaturedHighlights";
import { FeaturedArticles } from "@/components/magazine/FeaturedArticles";
import { CategoryBrowser } from "@/components/magazine/CategoryBrowser";
import { LeaderProfiles } from "@/components/magazine/LeaderProfiles";
import { InterviewSection } from "@/components/magazine/InterviewSection";
import { Newsletter } from "@/components/magazine/Newsletter";
import { Footer } from "@/components/magazine/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedHighlights />
        <FeaturedArticles />
        <CategoryBrowser />
        <LeaderProfiles />
        <InterviewSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
