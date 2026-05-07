import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Waitlist | Autobee.care",
  description: "Secure your spot for early access to Autobee in Trivandrum. Join 500+ vehicle owners and get a free premium wash on launch week!",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
