import Story from "@/components/story";
import { Banner, Marquee, Menu, ScrollFx } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Story />
      <ScrollFx>
        <Menu />
        <Banner />
        <Marquee />
      </ScrollFx>
    </>
  );
}
