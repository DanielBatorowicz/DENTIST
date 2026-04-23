import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Smile, Shield, Sparkles, CircleDot, Star, AlignCenter,
  Activity, AlertCircle, Heart, Award, Cpu, Home, ClipboardList,
  Calendar, ChevronRight, Phone, Quote, CheckCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const featuredServices = [
  { icon: Shield, title: "Check-ups & Cleanings", desc: "Preventive care to keep your smile healthy and bright with thorough professional cleaning." },
  { icon: Sparkles, title: "Teeth Whitening", desc: "Achieve a radiant, confident smile with our safe and clinically proven whitening treatments." },
  { icon: CircleDot, title: "Dental Implants", desc: "Permanent, natural-looking tooth replacements that restore full function and aesthetics." },
  { icon: Star, title: "Veneers", desc: "Porcelain veneers crafted to transform and perfect the appearance of your smile." },
  { icon: AlignCenter, title: "Orthodontics", desc: "Discreet teeth straightening with Invisalign and modern braces for all ages." },
  { icon: Heart, title: "Pediatric Dentistry", desc: "Gentle, friendly dental care tailored to make children feel safe and comfortable." },
];

const whyUs = [
  { icon: Award, title: "15+ Years of Excellence", desc: "Over a decade of trusted expertise delivering outstanding dental outcomes." },
  { icon: Cpu, title: "Modern Technology", desc: "State-of-the-art digital X-rays, intraoral cameras, and laser dentistry." },
  { icon: Heart, title: "Gentle, Caring Approach", desc: "We prioritise your comfort at every step — especially for nervous patients." },
  { icon: Home, title: "Premium Clinic Environment", desc: "A calm, spotlessly clean environment designed to put you at ease." },
  { icon: ClipboardList, title: "Transparent Treatment Plans", desc: "Clear, upfront pricing with no hidden costs — ever." },
  { icon: Calendar, title: "Flexible Scheduling", desc: "Early morning, evening, and Saturday appointments to fit your lifestyle." },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Patient since 2019",
    text: "Dr. Carter and her team made me feel completely at ease from my very first visit. I used to dread the dentist, but now I actually look forward to my check-ups. The clinic is beautiful and the care is exceptional.",
    rating: 5,
  },
  {
    name: "James Thompson",
    role: "Cosmetic patient",
    text: "I had veneers fitted and the results are incredible. My smile has genuinely changed my confidence. The process was explained clearly at every stage and the final result exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Emma Davies",
    role: "Invisalign patient",
    text: "Six months of Invisalign and I couldn't be happier. The team was supportive throughout, checking in regularly and making adjustments as needed. Totally worth it — my teeth look amazing.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Implant patient",
    text: "After losing a tooth in an accident, I was referred to Bright Smile for an implant. The procedure was smoother than I expected, and the result is completely indistinguishable from my natural teeth.",
    rating: 5,
  },
];

const stats = [
  { value: "4,500+", label: "Happy Patients" },
  { value: "15+", label: "Years of Experience" },
  { value: "98%", label: "Patient Satisfaction" },
  { value: "10+", label: "Specialist Services" },
];

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    document.title = "Bright Smile Dental Care | Trusted Dentist in London";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section data-testid="hero-section" className="pt-20 min-h-screen flex items-center hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-1/2 h-full bg-blue-50/40 rounded-l-[4rem]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
          {/* Left */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              Trusted Dental Care in London
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-[4.5rem] leading-tight font-medium text-slate-900 mb-6">
              Your Smile,<br />
              <span className="text-blue-600 italic">Our Passion</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              At Bright Smile Dental Care, we combine clinical excellence with genuine compassion to deliver a dental experience that's comfortable, transparent, and tailored to you.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                data-testid="hero-book-btn"
                onClick={() => setBookingOpen(true)}
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all"
              >
                Book an Appointment
              </button>
              <Link
                to="/services"
                data-testid="hero-services-btn"
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold px-6 py-4 rounded-full border-2 border-slate-200 hover:border-blue-200 transition-all"
              >
                Explore Services <ChevronRight size={18} />
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 text-sm text-slate-600">
              {["NHS Registered", "CQC Regulated", "BDA Member"].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src="https://images.pexels.com/photos/14052564/pexels-photo-14052564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920"
                alt="Friendly dentist with patient at Bright Smile Dental Care"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 max-w-[200px]">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-800 font-semibold text-sm">4.9/5 Rating</p>
              <p className="text-slate-500 text-xs mt-0.5">From 500+ reviews</p>
            </div>
            {/* Floating pill */}
            <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl shadow-lg px-4 py-3 text-center">
              <p className="font-bold text-xl leading-none">15+</p>
              <p className="text-blue-200 text-xs mt-0.5">Years of Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section data-testid="stats-section" className="py-14 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-4xl md:text-5xl font-semibold mb-1">{s.value}</p>
                <p className="text-blue-200 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section data-testid="intro-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/7789620/pexels-photo-7789620.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Modern dental clinic interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">CQC Regulated</p>
                    <p className="text-slate-500 text-xs">Outstanding Rating</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Welcome to Bright Smile</p>
              <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-6 leading-tight">
                Dental Care Built Around <em>You</em>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-5">
                Founded in 2008 and led by Dr. Emily Carter, Bright Smile Dental Care has grown to become one of London's most respected dental practices. We believe dental care should be accessible, comfortable, and completely transparent.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Whether you're coming in for a routine check-up, interested in cosmetic treatments, or need urgent care, our experienced team is here to support you with skill, honesty, and genuine warmth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  data-testid="intro-about-btn"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Meet Our Team <ChevronRight size={18} />
                </Link>
                <button
                  data-testid="intro-book-btn"
                  onClick={() => setBookingOpen(true)}
                  className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-full transition-all"
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section data-testid="services-section" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">What We Offer</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-4">
              Comprehensive Dental Services
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              From routine check-ups to advanced cosmetic treatments — all under one roof, with expert care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.title}
                data-testid={`service-card-${service.title.toLowerCase().replace(/\s/g, "-")}`}
                className="bg-white rounded-2xl p-7 border border-slate-100 card-hover group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <service.icon size={22} className="text-blue-600" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              data-testid="view-all-services-btn"
              className="inline-flex items-center gap-2 btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all"
            >
              View All Services <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section data-testid="why-us-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Why Choose Us</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-4">
              The Bright Smile Difference
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              We take great pride in the standard of care we provide — and it shows in everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, idx) => (
              <div
                key={item.title}
                data-testid={`why-us-card-${idx}`}
                className="flex items-start gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100 card-hover"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-testid="testimonials-section" className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Patient Stories</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-4">
              What Our Patients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                data-testid={`testimonial-card-${idx}`}
                className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm card-hover"
              >
                <Quote size={22} className="text-blue-200 mb-4" />
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section data-testid="cta-section" className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Take the First Step</p>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-white mb-5">
            Ready for a Healthier Smile?
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Book a consultation today and let us create a personalised treatment plan just for you. New patients are always welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-testid="cta-book-btn"
              onClick={() => setBookingOpen(true)}
              className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-9 py-4 rounded-full transition-all"
            >
              Book an Appointment
            </button>
            <a
              href="tel:+442071234567"
              data-testid="cta-phone-link"
              className="flex items-center justify-center gap-2 text-white border-2 border-slate-700 hover:border-slate-500 font-semibold px-8 py-4 rounded-full transition-all"
            >
              <Phone size={18} />
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
