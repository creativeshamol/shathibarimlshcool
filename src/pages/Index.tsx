import Navbar from "@/components/Navbar";
import NoticeTicker from "@/components/NoticeTicker";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import ResultSection from "@/components/ResultSection";
import NoticeSection from "@/components/NoticeSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <NoticeTicker />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ResultSection />
      <NoticeSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
