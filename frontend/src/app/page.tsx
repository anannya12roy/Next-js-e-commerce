import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import CategoriesSection from '@/components/CategoriesSection';
import NewArrivals from '@/components/NewArrivals';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <PromoBanner />
        <CategoriesSection />
        <NewArrivals />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}
