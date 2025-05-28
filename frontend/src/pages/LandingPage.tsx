import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorks";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BenefitsSection } from "@/components/landing/BenefitSection";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { CallToActionSection } from "@/components/landing/CallToActionSection";
import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";

export default function LandingPage() {
  return (
    <div className="antialiased text-slate-700">
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BenefitsSection />
      <ShowcaseSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
}
