import Navbar from "../components/Navbar";
import EmergencyBanner from "../components/EmergencyBanner";
import Footer from "../components/Footer";
import TvkBackground from "../components/TvkBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TvkBackground />
      <EmergencyBanner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
