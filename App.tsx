
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { PlanningForm } from './components/PlanningForm';
import { AIConcierge } from './components/AIConcierge';
import { DestinationsPage } from './components/DestinationsPage';
import { ContactModal } from './components/ContactModal';
import { HowItWorksPage } from './components/HowItWorksPage';
import { RoadtripsPage } from './components/RoadtripsPage';
import { AdminPanel } from './components/AdminPanel';
import { generateInitialItinerary } from './services/geminiService';
import { TripRequest, FeaturedTrip } from './types';
import { sendEnquiryEmail, formatTripRequestBody, openWhatsApp } from './services/emailService';
import { Map, Clock, ShieldCheck, Sparkle, Camera, Utensils, Mountain, MessageSquare, ClipboardCheck, PlaneTakeoff, HeartHandshake, Car, Heart, Settings } from 'lucide-react';

const INITIAL_DESTINATIONS: FeaturedTrip[] = [
  // ... (keep logic same)
];

// FEATURED_TRIPS constant removed in favor of dynamic state

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'destinations' | 'how-it-works' | 'roadtrips' | 'admin'>('home');

  // Initialize state from LocalStorage if available to persist Admin changes
  const [destinations, setDestinations] = useState<FeaturedTrip[]>(() => {
    const saved = localStorage.getItem('nomadDestinations');
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [itineraryPreview, setItineraryPreview] = React.useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = React.useState(false);

  // Save changes to LocalStorage whenever destinations change
  React.useEffect(() => {
    localStorage.setItem('nomadDestinations', JSON.stringify(destinations));
  }, [destinations]);

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['destinations', 'how-it-works', 'roadtrips', 'admin'].includes(hash)) {
        setCurrentView(hash as any);
      } else if (hash === 'home' || !hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // Initial check

    const handleNav = () => {
      setCurrentView('roadtrips');
      window.scrollTo(0, 0);
    };
    window.addEventListener('nav-roadtrips', handleNav);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('nav-roadtrips', handleNav);
    };
  }, []);

  // Update URL hash when view changes
  React.useEffect(() => {
    if (currentView === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = currentView;
    }
  }, [currentView]);
  const handleTripSubmit = async (data: TripRequest) => {
    setIsSubmitting(true);
    // Simulate thinking/processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate Itinerary Preview
    const preview = await generateInitialItinerary(data);
    setItineraryPreview(preview);
    setIsSubmitting(false);

    // Auto-Send Email
    const emailBody = formatTripRequestBody(data) + '\n\n' + 'AI Suggested Itinerary Preview:\n' + preview;
    await sendEnquiryEmail('New Trip Enquiry: ' + data.destination, emailBody, { ...data, _autoresponse: "Thank you for your enquiry. We will contact you soon." });

    // Suggest WhatsApp
    if (confirm("Email sent successfully! Would you like to also open WhatsApp to confirm details with our support team?")) {
      openWhatsApp(formatTripRequestBody(data));
    }
  };

  const renderHome = () => (
    <>
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The NomadNexus Edge</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We understand the Indian traveler. From large family groups to solo soul-searching, we curate what algorithms cannot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Transparent Bookings</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We handle the heavy lifting with hotels and airlines. You get our expert curation, and we take our commission directly from providers—no markups for you.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Concierge Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Need a last-minute car in Delhi or a veg meal in Tokyo? Our agents are available 24/7 on WhatsApp to ensure smooth travels.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Exclusive Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unlock stays at heritage palaces and private estates that aren't listed on standard booking portals. Experience India like royalty.
              </p>
            </div>
          </div>

          {/* Specialized Services */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-rose-50 p-10 text-left border border-rose-100 hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Heart className="w-32 h-32 text-rose-600" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-4 serif">Wedding Concierge</h3>
                <p className="text-slate-600 mb-8 max-w-sm">From royal palace weddings in Rajasthan to beach ceremonies in Goa. We plan, you celebrate.</p>
                <ul className="space-y-3 mb-8 text-sm font-medium text-slate-700">
                  <li className="flex items-center gap-2">✨ Venue Sourcing & Booking</li>
                  <li className="flex items-center gap-2">🕯️ Theme & Decor Planning</li>
                  <li className="flex items-center gap-2">🍽️ Catering & Guest Logistics</li>
                </ul>
                <button
                  onClick={() => { document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                >
                  Plan My Wedding
                </button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[2.5rem] bg-indigo-50 p-10 text-left border border-indigo-100 hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Car className="w-32 h-32 text-indigo-600" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-4 serif">Roadtrip Logistics</h3>
                <p className="text-slate-600 mb-8 max-w-sm">Self-drive or chauffeur-driven. We provide the wheels, the route, and the stays in between.</p>
                <ul className="space-y-3 mb-8 text-sm font-medium text-slate-700">
                  <li className="flex items-center gap-2">🚗 Premium Vehicle Fleet</li>
                  <li className="flex items-center gap-2">🗺️ Expert Route Itineraries</li>
                  <li className="flex items-center gap-2">🏨 Curated Heritage Pitstops</li>
                </ul>
                <button
                  onClick={() => { setCurrentView('roadtrips'); window.scrollTo(0, 0); }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Explore Roadtrips
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-indigo-50" id="how-it-works-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 serif">From Dream to Destination</h2>
            <p className="text-slate-600">Our seamless process to get you on your way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ring-8 ring-indigo-50">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Share Your Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Fill the form or chat with our AI to outline your ideal trip preferences.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ring-8 ring-indigo-50">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Expert Consult</h3>
              <p className="text-sm text-slate-500 leading-relaxed">A human travel designer calls you to refine the details and offer local secrets.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ring-8 ring-indigo-50">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Confirm & Book</h3>
              <p className="text-sm text-slate-500 leading-relaxed">We handle every booking, visa, and insurance requirement for you.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ring-8 ring-indigo-50">
                <PlaneTakeoff className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">4. Travel with Peace</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Fly out with 24/7 WhatsApp support. We're your backup for everything.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => { setCurrentView('how-it-works'); window.scrollTo(0, 0); }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Learn more about our process
            </button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-white" id="destinations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2 serif">Our Signature Curations</h2>
              <p className="text-slate-600">Hand-picked experiences across the subcontinent.</p>
            </div>
            <button
              onClick={() => { setCurrentView('destinations'); window.scrollTo(0, 0); }}
              className="text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              Explore All <Map className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations
              .filter(d => d.status === 'Active')
              .slice(0, 3)
              .map(trip => (
                <div key={trip.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100">
                  <div className="relative h-64 overflow-hidden">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {trip.tags.map(tag => (
                        <span key={tag} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-900 shadow-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{trip.location}</p>
                        <h3 className="text-2xl font-bold text-slate-900 serif">{trip.title}</h3>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                      <span className="font-bold text-slate-900">{trip.price}</span>
                      <button
                        onClick={() => setIsContactOpen(true)}
                        className="text-sm font-bold bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition-colors"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Planner & Chat Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-3">
              <PlanningForm onSubmit={handleTripSubmit} isSubmitting={isSubmitting} />

              {itineraryPreview && (
                <div className="mt-12 p-8 bg-indigo-50 rounded-3xl border-2 border-dashed border-indigo-200 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkle className="text-indigo-600" />
                    <h3 className="text-2xl font-bold serif">Your Draft Itinerary</h3>
                  </div>
                  <div className="prose prose-indigo max-w-none text-slate-700 whitespace-pre-wrap">
                    {itineraryPreview}
                  </div>
                  <p className="mt-8 text-sm text-indigo-600 italic">
                    Note: This is an AI-suggested flow. Our expert travel designers will now curate the final version with real-time hotel availability and flight timings.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 sticky top-28 space-y-8">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4 serif">Consult Your AI Expert</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Confused between Rajasthan or Kerala? Ask for weather updates, flight durations, or best shopping spots.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Camera className="w-5 h-5 text-indigo-400" /> Best sunrise in Varanasi
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Utensils className="w-5 h-5 text-emerald-400" /> Veg options in South Korea
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mountain className="w-5 h-5 text-amber-400" /> Trekking difficulty in Ladakh
                  </div>
                </div>
              </div>

              <AIConcierge />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">50k+</p>
              <p className="text-indigo-200 text-sm uppercase tracking-widest font-bold">Lakhs Saved</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">100%</p>
              <p className="text-indigo-200 text-sm uppercase tracking-widest font-bold">Curated for You</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">₹0</p>
              <p className="text-indigo-200 text-sm uppercase tracking-widest font-bold">Planning Fees</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">9/10</p>
              <p className="text-indigo-200 text-sm uppercase tracking-widest font-bold">Repeat Clients</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'home': return renderHome();
      case 'destinations': return <DestinationsPage destinations={destinations} />;
      case 'how-it-works': return <HowItWorksPage onStartPlanning={() => { setCurrentView('home'); setTimeout(() => { document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} />;
      case 'roadtrips': return <RoadtripsPage />;
      case 'admin': return <AdminPanel destinations={destinations} onUpdateDestinations={setDestinations} />;
      default: return renderHome();
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      onContactClick={() => setIsContactOpen(true)}
    >
      {renderContent()}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </Layout>
  );
};

export default App;
