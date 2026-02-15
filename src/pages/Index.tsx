import { Header } from "@/components/magazine/Header";
import { HeroSection } from "@/components/magazine/HeroSection";
import { FeaturedArticles } from "@/components/magazine/FeaturedArticles";
import { LatestArticles } from "@/components/magazine/LatestArticles";
import { BannerCarousel } from "@/components/magazine/BannerCarousel";
import { LeaderProfiles } from "@/components/magazine/LeaderProfiles";
import { InterviewSection } from "@/components/magazine/InterviewSection";
import { Newsletter } from "@/components/magazine/Newsletter";
import { Footer } from "@/components/magazine/Footer";
import { ScrollAnimationWrapper } from "@/components/magazine/ScrollAnimationWrapper";
import { ParallaxSection } from "@/components/magazine/ParallaxSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ScrollAnimationWrapper>
          <FeaturedArticles />
        </ScrollAnimationWrapper>
        <BannerCarousel />
        <ScrollAnimationWrapper direction="left">
          <LatestArticles />
        </ScrollAnimationWrapper>
        <BannerCarousel />
        <ParallaxSection speed={0.2}>
          <ScrollAnimationWrapper direction="left">
            <LeaderProfiles />
          </ScrollAnimationWrapper>
        </ParallaxSection>
        <ScrollAnimationWrapper direction="right">
          <InterviewSection />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper direction="scale">
          <Newsletter />
        </ScrollAnimationWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
