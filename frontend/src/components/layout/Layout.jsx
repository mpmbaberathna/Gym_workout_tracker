import Navbar from './Navbar'; // From template
import Footer from './Footer'; // From template

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;