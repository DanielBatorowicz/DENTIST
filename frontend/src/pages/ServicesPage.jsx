import { useState, useEffect } from "react";
import {
  Shield, Sparkles, CircleDot, Star, AlignCenter,
  Activity, AlertCircle, Heart, Smile, Scissors, ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import useSEO from "@/hooks/useSEO";

const services = [
  {
    id: "general-dentistry",
    icon: Shield,
    color: "blue",
    title: "General Dentistry",
    image: "https://images.pexels.com/photos/4270095/pexels-photo-4270095.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Dentist explaining treatment to patient in modern clinic",
    desc: "Comprehensive dental care covering all aspects of your oral health — the foundation of a healthy mouth and a confident smile.",
    benefits: ["Thorough oral health assessments", "Professional diagnosis & advice", "Treatment planning tailored to you", "Referrals to specialists when required"],
    for: "Suitable for all patients of all ages.",
  },
  {
    id: "checkups-cleanings",
    icon: Heart,
    color: "green",
    title: "Check-ups & Cleanings",
    image: "https://images.pexels.com/photos/6627527/pexels-photo-6627527.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Close-up of professional dental examination with dental mirror",
    desc: "Regular examinations and professional hygiene visits are the most effective way to prevent problems before they develop.",
    benefits: ["Full mouth X-ray examination", "Professional scale & polish", "Oral cancer screening", "Personalised home care advice"],
    for: "Recommended for all patients every 6 months.",
  },
  {
    id: "teeth-whitening",
    icon: Sparkles,
    color: "yellow",
    title: "Teeth Whitening",
    image: "https://images.pexels.com/photos/5622271/pexels-photo-5622271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Dentist performing professional teeth whitening treatment",
    desc: "Clinically supervised whitening treatments that are safe, effective, and tailored to your natural tooth shade.",
    benefits: ["In-chair power whitening", "Take-home whitening kits", "Safe for enamel when supervised", "Results lasting up to 2 years"],
    for: "Adults with healthy teeth seeking a brighter smile.",
  },
  {
    id: "dental-implants",
    icon: CircleDot,
    color: "blue",
    title: "Dental Implants",
    image: "https://images.unsplash.com/photo-1771442873035-474765b40ac6?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=700&h=400&fit=crop",
    imageAlt: "Gloved dentist holding a dental implant and porcelain crown",
    desc: "The gold standard for replacing missing teeth — a permanent, natural-looking solution that preserves jawbone and restores full function.",
    benefits: ["Titanium implants with 98% success rate", "Preserves natural bone structure", "Looks and feels like a real tooth", "Lifetime solution with proper care"],
    for: "Adults with one or more missing teeth.",
  },
  {
    id: "veneers",
    icon: Star,
    color: "purple",
    title: "Veneers",
    image: "https://images.pexels.com/photos/6627564/pexels-photo-6627564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Dentist carefully applying a porcelain veneer to patient's teeth",
    desc: "Ultra-thin porcelain veneers bonded to the front surface of your teeth to correct chips, discolouration, gaps, or misalignment.",
    benefits: ["Custom-crafted in a specialist lab", "Minimal tooth preparation required", "Stain-resistant porcelain material", "Natural finish lasting 10–15 years"],
    for: "Patients looking to transform their smile.",
  },
  {
    id: "orthodontics",
    icon: AlignCenter,
    color: "teal",
    title: "Orthodontics / Invisalign",
    image: "https://images.unsplash.com/photo-1651180352574-669683817463?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=700&h=400&fit=crop",
    imageAlt: "Clear Invisalign aligner tray for teeth straightening treatment",
    desc: "Straighten your teeth discreetly with Invisalign clear aligners or traditional fixed braces — custom plans for teenagers and adults.",
    benefits: ["Invisalign certified provider", "Removable, virtually invisible", "Traditional & ceramic braces available", "Progress monitored at check-ins"],
    for: "Teenagers and adults seeking a straighter smile.",
  },
  {
    id: "root-canal",
    icon: Activity,
    color: "red",
    title: "Root Canal Treatment",
    image: "https://images.unsplash.com/photo-1739902526173-06750b78cfb7?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=700&h=400&fit=crop",
    imageAlt: "Dentist performing a careful dental procedure on a patient",
    desc: "Modern root canal therapy is far more comfortable than its reputation suggests — we relieve tooth pain and save teeth that would otherwise need extraction.",
    benefits: ["Eliminates tooth pain effectively", "Saves your natural tooth", "Performed under local anaesthetic", "High success rate with modern techniques"],
    for: "Patients with infected or severely damaged teeth.",
  },
  {
    id: "emergency-care",
    icon: AlertCircle,
    color: "orange",
    title: "Emergency Dental Care",
    image: "https://images.pexels.com/photos/6193195/pexels-photo-6193195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Patient with toothache receiving urgent care at dental clinic",
    desc: "Dental emergencies don't wait. We offer same-day emergency appointments for severe toothache, broken teeth, lost fillings, and dental injuries.",
    benefits: ["Same-day emergency slots", "Pain relief as a priority", "Trauma and accident treatment", "Open to new & existing patients"],
    for: "Anyone experiencing acute dental pain or trauma.",
  },
  {
    id: "pediatric-dentistry",
    icon: Heart,
    color: "pink",
    title: "Pediatric Dentistry",
    image: "https://images.pexels.com/photos/8260438/pexels-photo-8260438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Cheerful child smiling in dental chair with dental team",
    desc: "A warm, positive, and fear-free environment that helps children develop a healthy relationship with dental care from an early age.",
    benefits: ["Child-friendly consulting rooms", "Gentle approach to build confidence", "Preventive sealants & fluoride", "Patient team experienced with kids"],
    for: "Children from first tooth through to teenage years.",
  },
  {
    id: "cosmetic-dentistry",
    icon: Smile,
    color: "blue",
    title: "Cosmetic Dentistry",
    image: "https://images.pexels.com/photos/16212691/pexels-photo-16212691.png?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Close-up of a perfectly white, beautiful smile after cosmetic treatment",
    desc: "A comprehensive range of cosmetic treatments to enhance and perfect your smile — from subtle improvements to complete smile makeovers.",
    benefits: ["Smile design consultations", "Composite & edge bonding", "Gum contouring & reshaping", "Full smile makeover packages"],
    for: "Anyone looking to improve their smile aesthetics.",
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

  useSEO({
    title: "Dental Services London | Whitening, Implants, Invisalign | Bright Smile",
    description: "Full range of dental services in London: teeth whitening, dental implants, veneers, Invisalign, root canal, emergency care & more. Book online with Dr. Emily Carter.",
    keywords: "dental services London, teeth whitening London, dental implants London, Invisalign London, veneers London, root canal London, cosmetic dentistry London, orthodontics London",
  });

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
            From preventive care to smile transformations — a full range of dental services delivered with expert precision and genuine care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section data-testid="services-grid" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                data-testid={`service-detail-${service.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] card-hover flex flex-col"
              >
                {/* Service Image */}
                <div className="h-48 overflow-hidden relative flex-shrink-0">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Color-tinted overlay strip at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-3 -mt-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[service.color]}`}>
                      <service.icon size={18} />
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-slate-900">{service.title}</h2>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{service.desc}</p>

                  {/* Benefits */}
                  <div className="flex-1 mb-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">Key Benefits</p>
                    <ul className="space-y-1.5">
                      {service.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                          <ChevronRight size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer: italic note + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto gap-3">
                    <span className="text-xs text-slate-400 italic leading-snug">{service.for}</span>
                    <button
                      data-testid={`book-service-${service.id}`}
                      onClick={() => setBookingOpen(true)}
                      className="btn-primary bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all flex-shrink-0"
                    >
                      Book Consultation
                    </button>
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
