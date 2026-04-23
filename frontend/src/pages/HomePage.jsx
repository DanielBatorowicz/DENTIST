import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Sparkles, CircleDot, Star, AlignCenter,
  Heart, Award, Cpu, Home, ClipboardList,
  Calendar, ChevronRight, Phone, Quote, CheckCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import useSEO from "@/hooks/useSEO";

const featuredServices = [
  {
    icon: Shield,
    title: "Check-ups & Cleanings",
    desc: "Preventive care to keep your smile healthy and bright with thorough professional cleaning.",
    image: "https://images.pexels.com/photos/6627527/pexels-photo-6627527.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Professional dental examination with dental mirror and tools",
  },
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    desc: "Achieve a radiant, confident smile with our safe and clinically proven whitening treatments.",
    image: "https://images.pexels.com/photos/5622271/pexels-photo-5622271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Dentist performing professional teeth whitening treatment on patient",
  },
  {
    icon: CircleDot,
    title: "Dental Implants",
    desc: "Permanent, natural-looking tooth replacements that restore full function and aesthetics.",
    image: "https://images.unsplash.com/photo-1771442873035-474765b40ac6?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=700&h=400&fit=crop",
    imageAlt: "Gloved dentist holding a titanium dental implant and ceramic crown",
  },
  {
    icon: Star,
    title: "Veneers",
    desc: "Porcelain veneers crafted to transform and perfect the appearance of your smile.",
    image: "https://images.pexels.com/photos/6627564/pexels-photo-6627564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Dentist carefully applying a porcelain veneer to a patient's tooth",
  },
  {
    icon: AlignCenter,
    title: "Orthodontics",
    desc: "Discreet teeth straightening with Invisalign and modern braces for all ages.",
    image: "https://images.unsplash.com/photo-1651180352574-669683817463?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=700&h=400&fit=crop",
    imageAlt: "Clear Invisalign aligner in its case for discreet teeth straightening",
  },
  {
    icon: Heart,
    title: "Pediatric Dentistry",
    desc: "Gentle, friendly dental care tailored to make children feel safe and comfortable.",
    image: "https://images.pexels.com/photos/8260438/pexels-photo-8260438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=700",
    imageAlt: "Happy child smiling in dental chair with friendly dental team",
  },
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

  useSEO({
    title: "Bright Smile Dental Care | Trusted Dentist in London",
    description: "Book an appointment at Bright Smile Dental Care on Harley Street, London. Expert general, cosmetic & emergency dentistry led by Dr. Emily Carter. New patients welcome.",
    keywords: "dentist in London, dental clinic London, cosmetic dentist London, family dentist London, emergency dentist London, teeth whitening London, dental implants London, Harley Street dentist",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section data-testid="hero-section" className="pt-20 min-h-screen flex items-center bg-white relative overflow-hidden">
        {/* Background: clean right panel + subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[52%] h-full bg-gradient-to-bl from-slate-50 via-blue-50/40 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: "radial-gradient(#2563EB 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative w-full">
          {/* Left */}
          <div className="animate-fade-in-up">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Trusted Dental Care · London, W1</span>
            </div>

            <h1 className="font-heading text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-medium text-slate-900 mb-7 tracking-tight">
              Your Smile,<br />
              <span className="italic text-gradient">Our Passion.</span>
            </h1>

            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-9 max-w-md">
              We combine clinical excellence with genuine compassion — delivering dental care that's comfortable, transparent, and tailored entirely to you.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                data-testid="hero-book-btn"
                onClick={() => setBookingOpen(true)}
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all flex items-center gap-2.5"
              >
                <Calendar size={17} />
                Book an Appointment
              </button>
              <Link
                to="/services"
                data-testid="hero-services-btn"
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold px-6 py-4 rounded-full border-2 border-slate-200 hover:border-blue-300 transition-all"
              >
                Explore Services <ChevronRight size={18} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 pt-6 border-t border-slate-100">
              {["NHS Registered", "CQC Outstanding", "BDA Member"].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  <span className="font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src="https://images.pexels.com/photos/14052564/pexels-photo-14052564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920"
                alt="Dr. Carter with patient at Bright Smile Dental Care London"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
            </div>
            {/* Rating card */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 min-w-[195px]">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-900 font-bold text-base">4.9 / 5 Rating</p>
              <p className="text-slate-400 text-xs mt-0.5">Based on 500+ Google reviews</p>
            </div>
            {/* Years badge */}
            <div className="absolute -top-5 -right-5 bg-blue-600 text-white rounded-2xl shadow-xl px-5 py-4 text-center">
              <p className="font-heading font-bold text-2xl leading-none">15+</p>
              <p className="text-blue-200 text-xs mt-1">Years of<br />Expert Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — Premium dark treatment */}
      <section data-testid="stats-section" className="py-20 bg-[#080E1C] relative overflow-hidden">
        {/* Ghost number decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden hidden lg:block">
          <span className="font-heading font-bold text-[16rem] leading-none text-white/[0.025]">15</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center px-4 ${i < stats.length - 1 ? "lg:border-r lg:border-white/10" : ""}`}>
                <p className="font-heading text-5xl md:text-6xl font-medium text-white mb-2">{s.value}</p>
                <div className="w-6 h-0.5 bg-blue-500 mx-auto mb-3 rounded-full" />
                <p className="text-slate-400 text-xs uppercase tracking-[0.15em] font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section data-testid="intro-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-blue-600/40" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 whitespace-nowrap">About Bright Smile</span>
            <div className="h-px w-8 bg-blue-600/40" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 mb-6 leading-[1.05] tracking-tight">
            Dental Care Built<br /><em className="text-gradient">Around You</em>
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-3 max-w-2xl mx-auto">
            Founded in 2008 by Dr. Emily Carter, Bright Smile has grown into one of London's most respected practices — built on transparency, clinical excellence, and genuine care.
          </p>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Whether it's a routine check-up, a smile makeover, or urgent care — we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about" data-testid="intro-about-btn" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold border-b-2 border-blue-200 hover:border-blue-600 transition-colors pb-0.5">
              Learn About Our Practice <ChevronRight size={18} />
            </Link>
            <button data-testid="intro-book-btn" onClick={() => setBookingOpen(true)} className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-full transition-all">
              Book a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Meet Dr. Carter — dark card */}
      <section data-testid="meet-doctor-section" className="py-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0 items-center">
              {/* Image */}
              <div className="relative h-72 md:h-full min-h-[360px] overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/6809667/pexels-photo-6809667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=600"
                  alt="Dr. Emily Carter, Principal Dentist at Bright Smile Dental Care"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/60 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:hidden" />
              </div>
              {/* Text */}
              <div className="px-8 py-10 md:px-12 md:py-14">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Your Dentist</p>
                <h2 className="font-heading text-3xl md:text-4xl font-medium text-white mb-2 leading-tight">
                  Dr. Emily Carter
                </h2>
                <p className="font-heading text-lg text-blue-400 italic mb-5">BDS, MFDS RCS — 15+ Years Experience</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Qualified at King's College London and one of the capital's most respected dentists. Dr. Carter specialises in making every patient — including nervous patients — feel safe, informed, and cared for.
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {["Invisalign Provider", "Cosmetic Dentistry", "BDA Member"].map((tag) => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/about"
                  data-testid="meet-doctor-link"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-full transition-all"
                >
                  Meet Dr. Carter <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section data-testid="services-section" className="py-24 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-blue-600/40" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 whitespace-nowrap">What We Offer</span>
              <div className="h-px w-8 bg-blue-600/40" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 mb-4 tracking-tight">
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
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] card-hover group flex flex-col"
              >
                {/* Image */}
                <div className="h-44 overflow-hidden flex-shrink-0">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <service.icon size={17} className="text-blue-600" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-slate-900">{service.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{service.desc}</p>
                </div>
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
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left — sticky text */}
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-blue-600/40 flex-shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 whitespace-nowrap">Why Choose Us</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 mb-5 leading-[1.05] tracking-tight">
                The Bright Smile<br /><em className="text-gradient">Difference</em>
              </h2>
              <p className="text-slate-500 text-base mb-8 leading-relaxed max-w-sm">
                We take great pride in the standard of care we provide — from the moment you walk in to the follow-up call afterwards.
              </p>
              <button
                data-testid="why-us-book-btn"
                onClick={() => setBookingOpen(true)}
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all"
              >
                Experience It Yourself
              </button>
            </div>
            {/* Right — feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map((item, idx) => (
                <div
                  key={item.title}
                  data-testid={`why-us-card-${idx}`}
                  className="bg-[#F8F9FC] rounded-2xl p-5 border border-slate-100 card-hover group"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-center mb-4 transition-colors shadow-sm">
                    <item.icon size={18} className="text-blue-600" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — Featured + 3 below */}
      <section data-testid="testimonials-section" className="py-24 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-blue-600/40" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 whitespace-nowrap">Patient Stories</span>
              <div className="h-px w-8 bg-blue-600/40" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight">
              What Our Patients Say
            </h2>
          </div>

          {/* Featured testimonial */}
          <div
            data-testid="testimonial-card-0"
            className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-start">
              <Quote size={56} className="text-blue-600/25 flex-shrink-0 hidden md:block" />
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="font-heading text-2xl md:text-3xl lg:text-[2rem] text-white leading-[1.35] italic mb-8 font-light max-w-3xl">
                  "{testimonials[0].text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {testimonials[0].name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonials[0].name}</p>
                    <p className="text-slate-400 text-sm">{testimonials[0].role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 smaller testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.slice(1).map((t, idx) => {
              const colors = ["bg-violet-600", "bg-emerald-600", "bg-amber-600"];
              return (
                <div
                  key={t.name}
                  data-testid={`testimonial-card-${idx + 1}`}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-9 h-9 ${colors[idx]} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">{t.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Review aggregate */}
          <div className="flex justify-center mt-10">
            <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-6 py-3 text-sm shadow-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <span className="font-bold text-slate-900">4.9 / 5</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">500+ verified reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section data-testid="cta-section" className="py-24 bg-[#080E1C] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-blue-500/40" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 whitespace-nowrap">Take the First Step</span>
            <div className="h-px w-8 bg-blue-500/40" />
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-5 tracking-tight leading-[1.0]">
            Ready for a<br />
            <em className="text-gradient">Healthier Smile?</em>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Book a consultation today and let us create a personalised treatment plan just for you. New patients are always welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-testid="cta-book-btn"
              onClick={() => setBookingOpen(true)}
              className="btn-primary bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-full transition-all"
            >
              Book an Appointment
            </button>
            <a
              href="tel:+442071234567"
              data-testid="cta-phone-link"
              className="flex items-center justify-center gap-2 text-slate-300 hover:text-white border border-white/15 hover:border-white/30 font-semibold px-8 py-4 rounded-full transition-all"
            >
              <Phone size={17} />
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
