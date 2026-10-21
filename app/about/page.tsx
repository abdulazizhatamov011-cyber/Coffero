import type { Metadata } from "next";
import { AboutStory, Banner, PageHero, Process, ScrollFx } from "@/components/sections";
import { PHOTOS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "How Coffero brews, pours and swirls every iced coffee.",
};

export default function AboutPage() {
  return (
    <ScrollFx>
      <PageHero
        page="about"
        title="Good things"
        accent="take time"
        photo={PHOTOS.hero}
      />
      <AboutStory />
      <Process />
      <Banner />
    </ScrollFx>
  );
}
