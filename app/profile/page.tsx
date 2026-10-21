import type { Metadata } from "next";
import ProfileView from "@/components/profile-view";
import ProfileTitle from "@/components/profile-title";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your Coffero account.",
};

export default function ProfilePage() {
  return (
    <section className="min-h-screen px-4 pb-20 pt-28 sm:px-[5vw] lg:pt-36">
      <ProfileTitle />
      <ProfileView />
    </section>
  );
}
