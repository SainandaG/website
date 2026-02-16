import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { WhyGannetz } from "@/components/sections/WhyGannetz";
import { IndustriesServe } from "@/components/sections/IndustriesServe";
import { EngagementModelsTimeline } from "@/components/sections/EngagementModels";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div>
      <Hero />
      <WhatWeDo />
      <WhyGannetz />
      <IndustriesServe />
      <EngagementModelsTimeline />
      <CTASection />
    </div>
  );
}
