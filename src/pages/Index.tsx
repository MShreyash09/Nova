import Navbar from "../components/Navbar";
import HeadphoneScrollSequence from "../components/HeadphoneScrollSequence";
import ExplodedViewSection from "../components/ExplodedViewSection";
import ColorVariantsSection from "../components/ColorVariantsSection";
import SpecsSection from "../components/SpecsSection";
import PreOrderSection from "../components/PreOrderSection";
import ReviewsSection from "../components/ReviewsSection";
import Footer from "../components/Footer";

/**
 * Index - Main single-page scrolling experience for Nova Spatial Audio.
 * Orchestrates all sections in order:
 * 1. Hero with floating 3D headphones
 * 2. Exploded engineering view (scroll-driven)
 * 3. Color variant selector
 * 4. Pre-order checkout form
 * 5. Community reviews
 */
const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <HeadphoneScrollSequence />
      <ExplodedViewSection />
      <ColorVariantsSection />
      <SpecsSection />
      <PreOrderSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
