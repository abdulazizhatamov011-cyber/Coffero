"use client";

import { useT } from "@/lib/i18n";

export default function ProfileTitle() {
  const t = useT();
  return (
    <h1 className="mb-8 font-display text-[clamp(40px,6vw,88px)] uppercase leading-[.9] lg:mb-12">
      {t("profile.title")}
    </h1>
  );
}
