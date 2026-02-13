
import React from 'react';
import { Compass, Menu, X, Plane, Instagram, Twitter, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: 'home' | 'destinations' | 'how-it-works' | 'roadtrips' | 'admin') => void;
  currentView: 'home' | 'destinations' | 'how-it-works' | 'roadtrips' | 'admin';
  onContactClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView, onContactClick }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLinkClick = (view: 'home' | 'destinations' | 'how-it-works' | 'roadtrips' | 'admin', e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => handleLinkClick('home', e as any)}
            >
              <Compass className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 serif">NomadNexus</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                onClick={(e) => handleLinkClick('destinations', e)}
                className={`text-sm font-medium transition-colors ${currentView === 'destinations' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                Destinations
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick('roadtrips', e)}
                className={`text-sm font-medium transition-colors ${currentView === 'roadtrips' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                Roadtrips
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick('how-it-works', e)}
                className={`text-sm font-medium transition-colors ${currentView === 'how-it-works' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                How it Works
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick('home', e)}
                className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                Start Planning
              </a>
              <button
                onClick={onContactClick}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Contact Agent
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <a href="#" onClick={(e) => handleLinkClick('destinations', e)} className="block text-lg font-medium">Destinations</a>
            <a href="#" onClick={(e) => handleLinkClick('roadtrips', e)} className="block text-lg font-medium">Roadtrips</a>
            <a href="#" onClick={(e) => handleLinkClick('how-it-works', e)} className="block text-lg font-medium">How it Works</a>
            <a href="#" onClick={(e) => handleLinkClick('home', e)} className="block text-lg font-medium">Start Planning</a>
            <button
              onClick={onContactClick}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              Contact Agent
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Plane className="w-6 h-6" />
                <span className="text-xl font-bold serif">NomadNexus</span>
              </div>
              <p className="text-sm leading-relaxed">
                Transforming the way you travel. Bespoke itineraries curated by experts, powered by intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick('admin', e)} className="hover:text-white transition-colors">Admin Panel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Custom Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Corporate Travel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Group Bookings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Social</h4>
              <div className="flex gap-4">
                <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                <button onClick={onContactClick} className="text-xs uppercase font-bold text-white hover:text-indigo-400">Contact Agent</button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-xs">
            © {new Date().getFullYear()} NomadNexus Travel Group. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
