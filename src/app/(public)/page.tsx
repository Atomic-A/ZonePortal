import HeroSection from "../components/HeroSection";
import LiveFeedSlider from "../components/LiveFeedSlider";
import PoonamalleeZoneDetails from "../components/PoonamalleeZoneDetails";
import KnowYourWard from "../components/KnowYourWard";
import NidhiDashboard from "../components/NidhiDashboard";
import ManuSystem from "../components/ManuSystem";
import WelfareSchemes from "../components/WelfareSchemes";
import TownHallPoll from "../components/TownHallPoll";

export default function Home() {
  return (
    <>
      <HeroSection />
      
      <section className="py-12 bg-transparent z-10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveFeedSlider />
        </div>
      </section>

      <PoonamalleeZoneDetails />

      <KnowYourWard />
      <NidhiDashboard />
      <ManuSystem />
      <WelfareSchemes />
      <TownHallPoll />
    </>
  );
}
