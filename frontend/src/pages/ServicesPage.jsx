import { useState } from "react";
import {
  Shield, Sparkles, CircleDot, Star, AlignCenter,
  Activity, AlertCircle, Heart, Smile, Scissors, ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const services = [
  {
    id: "general-dentistry",
    icon: Shield,
    title: "General Dentistry",
    desc: "Comprehensive dental care covering all aspects of your oral health. Our general dentistry services form the foundation of a healthy mouth and a confident smile.",
    benefits: ["Thorough oral health assessments", "Professional diagnosis & advice", "Treatment planning tailored to your needs", "Referrals to specialists when required"],
    for: "Suitable for all patients of all ages.",
    color: "blue",
  },
  {
    id: "checkups-cleanings",
    icon: Heart,
    title: "Check-ups & Cleanings",
    desc: "Regular dental examinations and professional hygiene visits are the most effective way to prevent problems before they develop. We recommend visiting every six months.",
    benefits: ["Full mouth examination including X-rays", "Professional scale & polish", "Oral cancer screening", "Personalised home care advice"],
    for: "Recommended for all patients every 6 months.",
    color: "green",
  },
  {
    id: "teeth-whitening",
    icon: Sparkles,
    title: "Teeth Whitening",
    desc: "Our clinically supervised whitening treatments are safe, effective, and tailored to your natural tooth shade. Achieve noticeably brighter teeth in as little as one session.",
    benefits: ["In-chair power whitening available", "Take-home whitening kits", "Safe for enamel when dentist-supervised", "Results lasting up to 2 years"],
    for: "Adults with healthy teeth looking to enhance their smile.",
    color: "yellow",
  },
  {
    id: "dental-implants",
    icon: CircleDot,
    title: "Dental Implants",
    desc: "The gold standard for replacing missing teeth, dental implants provide a permanent, natural-looking solution that preserves your jawbone and restores full function.",
    benefits: ["Titanium implants with 98% success rate", "Preserves natural bone structure", "Looks, feels, and functions like a real tooth", "Lifetime solution with proper care"],
    for: "Adults with one or more missing teeth.",
    color: "blue",
  },
  {
    id: "veneers",
    icon: Star,
    title: "Veneers",
    desc: "Ultra-thin porcelain veneers are bonded to the front surface of your teeth to correct chips, discolouration, gaps, or misalignment — delivering a stunning, natural result.",
    benefits: ["Custom-crafted in a specialist dental lab", "Minimal tooth preparation required", "Stain-resistant porcelain material", "Natural-looking finish that lasts 10–15 years"],
    for: "Patients looking to transform the appearance of their smile.",
    color: "purple",
  },
  {
    id: "orthodontics",
    icon: AlignCenter,
    title: "Orthodontics / Invisalign",
    desc: "Straighten your teeth discreetly with Invisalign clear aligners or traditional fixed braces. We create custom treatment plans for both teenagers and adults.",
    benefits: ["Invisalign certified provider", "Removable, virtually invisible aligners", "Traditional and ceramic braces available", "Progress monitored at regular check-ins"],
    for: "Teenagers and adults seeking a straighter smile.",
    color: "teal",
  },
  {
    id: "root-canal",
    icon: Activity,
    title: "Root Canal Treatment",
    desc: "Modern root canal therapy is far more comfortable than its reputation suggests. We use advanced techniques to relieve tooth pain and save teeth that would otherwise need extraction.",
    benefits: ["Eliminates tooth pain effectively", "Saves your natural tooth", "Performed under local anaesthetic", "High success rate with modern techniques"],
    for: "Patients with infected or severely damaged teeth.",
    color: "red",
  },
  {
    id: "emergency-care",
    icon: AlertCircle,
    title: "Emergency Dental Care",
    desc: "Dental emergencies don't wait. We offer same-day emergency appointments for urgent cases including severe toothache, broken teeth, lost fillings, and dental injuries.",
    benefits: ["Same-day emergency appointments", "Pain relief as a priority", "Trauma and accident treatment", "Available to both new and existing patients"],
    for: "Anyone experiencing acute dental pain or dental trauma.",
    color: "orange",
  },
  {
    id: "pediatric-dentistry",
    icon: Heart,
    title: "Pediatric Dentistry",
    desc: "We create a warm, positive, and fear-free environment to help children develop a healthy relationship with dental care from an early age.",
    benefits: ["Child-friendly consulting rooms", "Gentle approach to build dental confidence", "Preventive sealants and fluoride treatments", "Friendly, patient team experienced with children"],
    for: "Children from first tooth through to teenage years.",
    color: "pink",
  },
  {
    id: "cosmetic-dentistry",
    icon: Smile,
    title: "Cosmetic Dentistry",
    desc: "A comprehensive range of cosmetic treatments to enhance and perfect your smile. From subtle improvements to complete smile makeovers, we design treatments around your goals.",
    benefits: ["Smile design consultations available", "Composite bonding and edge bonding", "Gum contouring and reshaping", "Full smile makeover packages"],
    for: "Anyone looking to improve the aesthetics of their smile.",
    color: "blue",
  },
];

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  teal: "bg-teal-50 text-teal-600",
  red: "bg-red-50 text-red-600",
  orange: "bg-orange-50 text-orange-600",
  pink: "bg-pink-50 text-pink-600",
};

export default function ServicesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Hero */}
      <section data-testid="services-hero" className="pt-28 pb-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Our Services</p>
          <h1 className="font-heading text-5xl md:text-6xl font-medium text-slate-900 mb-5">
            Comprehensive Dental Care
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From preventive care to smile transformations — we offer a full range of dental services delivered with expert precision and genuine care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section data-testid="services-grid" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                data-testid={`service-detail-${service.id}`}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 card-hover"
              >
                <div className="flex items-start gap-5">
                  <div className={`w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0 p-3 ${colorMap[service.color]}`}>
                    <service.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-2xl font-semibold text-slate-900 mb-2">{service.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">{service.desc}</p>

                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Key Benefits</p>
                      <ul className="space-y-2">
                        {service.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <ChevronRight size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-200">
                      <span className="text-xs text-slate-500 italic">{service.for}</span>
                      <button
                        data-testid={`book-service-${service.id}`}
                        onClick={() => setBookingOpen(true)}
                        className="btn-primary bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-testid="services-cta" className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-800/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-white mb-5">
            Not Sure Which Treatment You Need?
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Book a consultation and Dr. Carter will assess your oral health, discuss your goals, and recommend the most appropriate treatment plan for you.
          </p>
          <button
            data-testid="services-cta-book-btn"
            onClick={() => setBookingOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-9 py-4 rounded-full transition-all shadow-lg"
          >
            Book a Free Consultation
          </button>
        </div>
      </section>

      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
