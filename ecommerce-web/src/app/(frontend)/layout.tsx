import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
