import { loaders } from "@/data/loaders";
import { validateApiResponse } from "@/lib/error-handler";

import { HeroSection, type IHeroSectionProps } from "@/components/custom/hero-section";
import { FeaturesSection, type IFeaturesSectionProps } from "@/components/custom/features-section";

// Union type of all possible block components
export type TBlocks = IHeroSectionProps | IFeaturesSectionProps;

function blockRenderer(block: TBlocks, index: number) {
  switch (block.__component) {
    case "layout.hero-section":
      return <HeroSection key={index} data={block as IHeroSectionProps} />;
    case "layout.features-section":
      return (
        <FeaturesSection key={index} data={block as IFeaturesSectionProps} />
      );
    default:
      return null;
  }
}

export default async function Home() {
  const homePageData = await loaders.getHomePageData();
  const data = validateApiResponse(homePageData, "home page");
  const { blocks } = data;

  return (
    <main>{blocks.map((block, index) => blockRenderer(block, index))}</main>
  );
}
