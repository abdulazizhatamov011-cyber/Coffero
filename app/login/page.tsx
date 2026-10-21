import type { Metadata } from "next";
import AuthCard from "@/components/auth-card";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your Coffero account.",
};

export default function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_30%_20%,#f3e2c4_0%,#e8cfa6_55%,#dcbd8f_100%)] px-4 py-10 sm:px-[5vw]">
      <AuthCard />
    </section>
  );
}
