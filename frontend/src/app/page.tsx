import Hero from '@/components/Hero';
import PromoBanner from '@/components/PromoBanner';
import CategoriesSection from '@/components/CategoriesSection';
import NewArrivals from '@/components/NewArrivals';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <CategoriesSection />
      <NewArrivals />
      <ProductGrid />
    </>
  );
}
