import { useState } from "react";
import { CheckCircle, Award, Heart, Cpu, Users, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const qualifications = [
  { title: "BDS – Bachelor of Dental Surgery", institution: "King's College London" },
  { title: "MFDS RCS – Member of the Faculty of Dental Surgery", institution: "Royal College of Surgeons of England" },
  { title: "Advanced Certificate in Cosmetic Dentistry", institution: "British Academy of Cosmetic Dentistry" },
  { title: "Diploma in Orthodontics", institution: "University of London" },
];

const values = [
  {
    icon: Heart,
    title: "Patient-First Approach",
    desc: "Every treatment decision we make starts with your wellbeing, comfort, and long-term oral health as our primary concern.",
  },
  {
    icon: Cpu,
    title: "Evidence-Based Dentistry",
    desc: "We stay current with the latest research, materials, and techniques to ensure you receive the highest standard of care.",
  },
  {
    icon: Award,
    title: "Commitment to Excellence",
    desc: "From the moment you walk in to your post-treatment follow-up, we hold ourselves to the very highest clinical and service standards.",
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Hero */}
      <section data-testid="about-hero" className="pt-28 pb-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">About Us</p>
          <h1 className="font-heading text-5xl md:text-6xl font-medium text-slate-900 mb-5">
            Meet Dr. Emily Carter
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A compassionate, highly-qualified dental surgeon dedicated to giving every patient a smile they're proud of.
          </p>
        </div>
      </section>

      {/* Dr. Intro */}
      <section data-testid="doctor-intro" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-[3/4]">
                <img
                  src="https://images.pexels.com/photos/7789620/pexels-photo-7789620.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Dr. Emily Carter at Bright Smile Dental Care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl shadow-xl p-5 max-w-[180px]">
                <p className="font-heading text-3xl font-semibold">15+</p>
                <p className="text-blue-200 text-sm mt-0.5">Years of Practice</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Principal Dentist</p>
              <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-5 leading-tight">
                Dr. Emily Carter,<br />
                <span className="text-blue-600">BDS MFDS RCS</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-5 text-base">
                Dr. Emily Carter qualified from King's College London in 2008 and has since built a reputation as one of London's most trusted and patient-centred dentists. With over 15 years of clinical experience spanning general, cosmetic, and restorative dentistry, she brings both technical excellence and a warm, reassuring presence to every appointment.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8 text-base">
                Dr. Carter is particularly passionate about helping nervous patients overcome their anxiety and experience dental care that is genuinely comfortable and stress-free. She takes time to listen, explain every step clearly, and ensure each patient leaves feeling confident and well-cared for.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Specialist interest in cosmetic and restorative dentistry",
                  "Trained provider for Invisalign clear aligners",
                  "Proficient in advanced implantology and smile design",
                  "Fluent in English, French, and Spanish",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{point}</span>
                  </div>
                ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {qualifications.map((q, idx) => (
              <div
                key={idx}
                data-testid={`qualification-card-${idx}`}
                className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 card-hover"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900">{q.title}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{q.institution}</p>
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
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Everything we do is guided by a set of values that place your health, comfort, and experience at the heart of our practice.
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

      {/* Team image + CTA */}
      <section data-testid="about-cta" className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-white mb-5">
            Ready to Experience the Difference?
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            We welcome new patients warmly. Book a consultation with Dr. Carter and discover dental care you can truly trust.
          </p>
          <button
            data-testid="about-book-btn"
            onClick={() => setBookingOpen(true)}
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-9 py-4 rounded-full transition-all"
          >
            Book a Consultation
          </button>
        </div>
      </section>

      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
