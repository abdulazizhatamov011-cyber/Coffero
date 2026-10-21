import type { Metadata } from "next";
import { ContactForm, PageHero, ScrollFx, Visit } from "@/components/sections";
import { PHOTOS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit Coffero in Tashkent or send us a message.",
};

export default function ContactPage() {
  return (
    <ScrollFx>
      <PageHero
        page="contact"
        title="Let's"
        accent="talk"
        photo={PHOTOS.visit}
      />
      <Visit />
      <ContactForm />
    </ScrollFx>
  );
}
