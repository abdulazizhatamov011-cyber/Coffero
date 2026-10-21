import type { Metadata } from "next";
import { Marquee, Menu, PageHero, ScrollFx } from "@/components/sections";
import { PHOTOS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menu",
  description: "Our iced coffee classics and add-ons.",
};

export default function MenuPage() {
  return (
    <ScrollFx>
      <PageHero
        page="menu"
        title="Pick your"
        accent="swirl"
        photo={PHOTOS.honey}
      />
      <Marquee />
      <Menu full />
    </ScrollFx>
  );
}
