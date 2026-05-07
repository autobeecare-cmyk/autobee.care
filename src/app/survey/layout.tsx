import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Owner Survey | Autobee.care",
  description: "Help us build the future of vehicle care in Trivandrum. Complete our 2-minute survey and win 3 free premium washes!",
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
