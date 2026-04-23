import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Award, Heart, Cpu, Quote, ChevronRight, Star, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import useSEO from "@/hooks/useSEO";

const credentials = ["BDS – King's College London", "MFDS RCS", "Invisalign Certified", "BDA Member", "CQC Regulated"];

const qualifications = [
  { year: "2008", title: "BDS – Bachelor of Dental Surgery", institution: "King's College London", icon: Award },
  { year: "2011", title: "MFDS RCS – Faculty of Dental Surgery", institution: "Royal College of Surgeons of England", icon: Award },
  { year: "2014", title: "Advanced Certificate in Cosmetic Dentistry", institution: "British Academy of Cosmetic Dentistry", icon: Award },
  { year: "2016", title: "Diploma in Orthodontics", institution: "University of London", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Patient-First Approach",
    desc: "Every decision starts with your wellbeing, comfort, and long-term oral health as our primary concern.",
  },
  {
    icon: Cpu,
    title: "Evidence-Based Dentistry",
    desc: "We stay current with the latest research and techniques to ensure the highest standard of care.",
  },
  {
    icon: Award,
    title: "Commitment to Excellence",
    desc: "From the moment you walk in to your post-treatment follow-up, we hold ourselves to the very highest standards.",
  },
];

const teamStats = [
  { value: "4,500+", label: "Patients Treated" },
  { value: "15+", label: "Years in Practice" },
  { value: "10", label: "Specialist Services" },
  { value: "98%", label: "Patient Satisfaction" },
];

export default function AboutPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  useSEO({
    title: "About Dr. Emily Carter | Bright Smile Dental Care London",
    description: "Meet Dr. Emily Carter BDS MFDS RCS — London's trusted principal dentist with 15+ years in general, cosmetic & restorative dentistry. Based at Harley Street, London.",
    keywords: "Dr Emily Carter dentist London, cosmetic dentist Harley Street, experienced dentist London, dental surgeon London, about Bright Smile Dental Care",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Doctor Hero — Premium Full Layout */}
      <section data-testid="about-hero" className="pt-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[85vh] items-center">

            {/* Left — Photo Column */}
            <div className="relative flex items-end justify-center py-12 lg:py-0 order-2 lg:order-1">
              {/* Blue decorative background shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-[3rem] mx-4 lg:mx-0 lg:rounded-r-none lg:rounded-l-[3rem]" />

              {/* Doctor portrait */}
              <div className="relative z-10 w-full max-w-sm mx-auto lg:mx-0 lg:ml-8">
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[3/4]">
                  <img
                    src="https://images.pexels.com/photos/6809667/pexels-photo-6809667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=600"
                    alt="Dr. Emily Carter, Principal Dentist at Bright Smile Dental Care"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Experience badge — overlaid on photo bottom-right */}
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white rounded-2xl shadow-xl px-5 py-4 text-center min-w-[110px]">
                  <p className="font-heading text-3xl font-semibold leading-none">15+</p>
                  <p className="text-blue-200 text-xs mt-1 font-medium">Years of<br/>Excellence</p>
                </div>

                {/* Rating badge — overlaid on photo top-left */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-800 font-semibold text-sm">4.9 / 5</p>
                  <p className="text-slate-400 text-xs">Google Reviews</p>
                </div>
              </div>
            </div>

            {/* Right — Bio Column */}
            <div className="py-16 lg:py-24 lg:pl-16 order-1 lg:order-2">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Principal Dentist & Founder</p>
              <h1 className="font-heading text-5xl md:text-6xl font-medium text-slate-900 mb-2 leading-tight">
                Dr. Emily<br />Carter
              </h1>
              <p className="font-heading text-2xl text-blue-600 italic mb-6">BDS, MFDS RCS</p>

              {/* Credential chips */}
              <div className="flex flex-wrap gap-2 mb-7">
                {credentials.map((c) => (
                  <span key={c} className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-slate-600 text-base leading-relaxed mb-5">
                Dr. Emily Carter qualified from King's College London in 2008 and has since built a reputation as one of London's most trusted and patient-centred dentists. With over 15 years spanning general, cosmetic, and restorative dentistry, she brings both clinical excellence and genuine warmth to every appointment.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Particularly passionate about nervous patients, Dr. Carter takes time to listen, explain every step clearly, and ensure each patient leaves feeling comfortable, confident, and well cared for.
              </p>

              <div className="flex flex-col gap-2.5 mb-8">
                {[
                  "Specialist in cosmetic and restorative dentistry",
                  "Certified Invisalign provider",
                  "Advanced implantology and smile design",
                  "Fluent in English, French, and Spanish",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={13} className="text-blue-600" />
                    </div>
                    <span className="text-slate-600 text-sm">{point}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  data-testid="about-book-btn"
                  onClick={() => setBookingOpen(true)}
                  className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all flex items-center gap-2"
                >
                  <Calendar size={17} />
                  Book with Dr. Carter
                </button>
                <a
                  href="tel:+442071234567"
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold px-6 py-4 rounded-full border-2 border-slate-200 hover:border-blue-200 transition-all"
                >
                  Call the Clinic
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Signature Quote */}
      <section data-testid="doctor-quote" className="py-16 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-64 h-64 bg-blue-700/10 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Quote size={48} className="text-blue-600/30 mb-4" />
          <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed italic mb-6">
            "Every patient who walks through our door deserves not just exceptional clinical care, but genuine compassion and complete transparency. That is the standard we hold ourselves to, every single day."
          </blockquote>
          <p className="text-blue-300 font-semibold tracking-wide">— Dr. Emily Carter, Principal Dentist</p>
        </div>
      </section>

      {/* Working Image Banner */}
      <section data-testid="doctor-work" className="py-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-slate-100 col-span-2">
              <img
                src="https://images.pexels.com/photos/7803051/pexels-photo-7803051.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Dr. Emily Carter reviewing a patient's dental X-ray"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl overflow-hidden flex-1 shadow-sm border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/4269264/pexels-photo-4269264.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="State-of-the-art dental treatment room at Bright Smile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-blue-600 rounded-2xl p-6 text-white flex-none">
                <p className="font-heading text-3xl font-semibold">4,500+</p>
                <p className="text-blue-200 text-sm mt-1">Patients who've trusted Dr. Carter with their smile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section data-testid="qualifications-section" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Education & Credentials</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900">
              Qualifications & Training
            </h2>
          </div>
          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            {qualifications.map((q, idx) => (
              <div
                key={idx}
                data-testid={`qualification-card-${idx}`}
                className="flex gap-5 mb-6 last:mb-0"
              >
                {/* Year bubble + line */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md">
                    {q.year}
                  </div>
                  {idx < qualifications.length - 1 && (
                    <div className="w-0.5 bg-blue-100 flex-1 mt-2 mb-0 min-h-[24px]" />
                  )}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 flex-1 card-hover mb-2">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 mb-1">{q.title}</h3>
                  <p className="text-slate-500 text-sm">{q.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section data-testid="about-stats" className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {teamStats.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-4xl md:text-5xl font-semibold">{s.value}</p>
                <p className="text-blue-200 text-sm mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section data-testid="values-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Our Philosophy</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Everything we do is guided by values that place your health, comfort, and experience at the heart of our practice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                data-testid={`value-card-${v.title.toLowerCase().replace(/\s/g, "-")}`}
                className="text-center bg-slate-50 rounded-2xl p-8 border border-slate-100 card-hover"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <v.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-testid="about-cta" className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-white mb-5">
            Ready to Meet Dr. Carter?
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            New patients are always welcome. Book a consultation and experience the warmth and expertise that our patients trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-testid="about-cta-book-btn"
              onClick={() => setBookingOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-9 py-4 rounded-full transition-all shadow-lg"
            >
              Book a Consultation
            </button>
            <Link
              to="/services"
              className="flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white/60 font-semibold px-8 py-4 rounded-full transition-all"
            >
              View Services <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
