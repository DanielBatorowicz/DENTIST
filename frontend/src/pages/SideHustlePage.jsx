import { useState } from "react";
import {
  Briefcase, TrendingUp, DollarSign, Clock, Star,
  GraduationCap, Pen, Video, Users, Stethoscope,
  FlaskConical, Smile, ChevronRight, CheckCircle,
  ArrowRight, Lightbulb, Target, Zap
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const sideHustles = [
  {
    id: 1,
    icon: GraduationCap,
    title: "Online Dental Courses",
    category: "Education",
    earning: "3,000 - 10,000+",
    timeCommitment: "5-10 hrs/week",
    difficulty: "Medium",
    rating: 5,
    description: "Create and sell online courses teaching dental hygiene, oral health, or exam prep for dental students. Platforms like Udemy, Teachable, or your own site.",
    benefits: [
      "Passive income once created",
      "Leverage your expertise",
      "Flexible schedule",
      "Global reach"
    ],
    bestFor: "Dentists who enjoy teaching and can explain complex topics simply.",
    color: "blue",
  },
  {
    id: 2,
    icon: Video,
    title: "Dental Content Creation",
    category: "Social Media",
    earning: "1,000 - 15,000+",
    timeCommitment: "3-8 hrs/week",
    difficulty: "Low",
    rating: 5,
    description: "Build a following on YouTube, TikTok, or Instagram sharing dental tips, myth-busting, and behind-the-scenes clinic content. Monetise through ads, sponsorships, and brand deals.",
    benefits: [
      "Low startup cost",
      "Builds personal brand",
      "Attracts new patients",
      "Sponsorship opportunities"
    ],
    bestFor: "Personable dentists comfortable on camera with a knack for storytelling.",
    color: "purple",
  },
  {
    id: 3,
    icon: Pen,
    title: "Dental Consulting & Writing",
    category: "Freelance",
    earning: "2,000 - 8,000",
    timeCommitment: "5-10 hrs/week",
    difficulty: "Medium",
    rating: 4,
    description: "Write articles, whitepapers, or textbook chapters for dental publications. Consult for dental startups, product companies, or insurance firms on clinical matters.",
    benefits: [
      "High hourly rates",
      "Industry recognition",
      "Networking opportunities",
      "Work from anywhere"
    ],
    bestFor: "Detail-oriented dentists who write well and enjoy research.",
    color: "emerald",
  },
  {
    id: 4,
    icon: Stethoscope,
    title: "Locum / Freelance Dentistry",
    category: "Clinical",
    earning: "4,000 - 12,000",
    timeCommitment: "1-3 days/week",
    difficulty: "Low",
    rating: 4,
    description: "Work as a locum dentist at other practices on your days off. High demand across the UK means premium day rates, especially for specialists.",
    benefits: [
      "Immediate high income",
      "No patient admin",
      "Variety of settings",
      "Flexible commitments"
    ],
    bestFor: "Dentists wanting to maximise clinical income with minimal overhead.",
    color: "amber",
  },
  {
    id: 5,
    icon: FlaskConical,
    title: "Dental Product Development",
    category: "Entrepreneurship",
    earning: "5,000 - 50,000+",
    timeCommitment: "10-15 hrs/week",
    difficulty: "High",
    rating: 4,
    description: "Develop or co-develop dental products — whitening kits, specialised toothpastes, aligners, or dental instruments. Partner with manufacturers or launch a D2C brand.",
    benefits: [
      "Scalable revenue",
      "Patent potential",
      "Industry disruption",
      "Equity value"
    ],
    bestFor: "Entrepreneurial dentists with product ideas and business acumen.",
    color: "rose",
  },
  {
    id: 6,
    icon: Users,
    title: "Practice Management Coaching",
    category: "Coaching",
    earning: "3,000 - 15,000",
    timeCommitment: "5-10 hrs/week",
    difficulty: "Medium",
    rating: 5,
    description: "Coach other dentists on running profitable practices — patient acquisition, team management, pricing strategies, and systems optimisation.",
    benefits: [
      "Premium pricing",
      "Recurring clients",
      "Group programmes scale",
      "Deep professional impact"
    ],
    bestFor: "Experienced practice owners who have built successful clinics.",
    color: "indigo",
  },
  {
    id: 7,
    icon: Smile,
    title: "Cosmetic Dentistry Workshops",
    category: "Education",
    earning: "2,000 - 8,000",
    timeCommitment: "Weekend events",
    difficulty: "Medium",
    rating: 4,
    description: "Run hands-on workshops teaching composite bonding, veneer placement, or smile design to other dentists. Charge premium rates for small-group, intensive training.",
    benefits: [
      "High per-event income",
      "Builds authority",
      "Networking with peers",
      "Repeat attendees"
    ],
    bestFor: "Skilled cosmetic dentists who can teach hands-on techniques.",
    color: "teal",
  },
  {
    id: 8,
    icon: Lightbulb,
    title: "Dental Expert Witness",
    category: "Legal",
    earning: "3,000 - 20,000+",
    timeCommitment: "Variable",
    difficulty: "High",
    rating: 3,
    description: "Provide expert testimony and reports for legal cases involving dental negligence, malpractice, or personal injury claims. Solicitors pay premium rates for qualified opinions.",
    benefits: [
      "Very high hourly rate",
      "Intellectually stimulating",
      "Prestigious work",
      "Flexible case-by-case"
    ],
    bestFor: "Experienced dentists with strong clinical knowledge and attention to detail.",
    color: "slate",
  },
];

const categoryColors = {
  Education: "bg-blue-50 text-blue-700",
  "Social Media": "bg-purple-50 text-purple-700",
  Freelance: "bg-emerald-50 text-emerald-700",
  Clinical: "bg-amber-50 text-amber-700",
  Entrepreneurship: "bg-rose-50 text-rose-700",
  Coaching: "bg-indigo-50 text-indigo-700",
  Legal: "bg-slate-100 text-slate-700",
};

const colorMap = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100", accent: "bg-blue-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100", accent: "bg-purple-600" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-100", accent: "bg-emerald-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100", accent: "bg-amber-600" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-100", accent: "bg-rose-600" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-100", accent: "bg-indigo-600" },
  teal: { bg: "bg-teal-50", icon: "text-teal-600", border: "border-teal-100", accent: "bg-teal-600" },
  slate: { bg: "bg-slate-50", icon: "text-slate-600", border: "border-slate-200", accent: "bg-slate-600" },
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}
        />
      ))}
    </div>
  );
}

function HustleCard({ hustle, onSelect, isSelected }) {
  const Icon = hustle.icon;
  const colors = colorMap[hustle.color];

  return (
    <button
      data-testid={`hustle-card-${hustle.id}`}
      onClick={() => onSelect(hustle.id)}
      className={`w-full text-left bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? `${colors.border} shadow-lg ring-2 ring-blue-200`
          : "border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[hustle.category]}`}>
              {hustle.category}
            </span>
            <StarRating rating={hustle.rating} />
          </div>
          <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1">{hustle.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{hustle.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <DollarSign size={14} />
              {hustle.earning}/mo
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock size={14} />
              {hustle.timeCommitment}
            </span>
          </div>
        </div>
        <ChevronRight size={20} className={`flex-shrink-0 mt-1 transition-colors ${isSelected ? "text-blue-600" : "text-slate-300"}`} />
      </div>
    </button>
  );
}

function DetailPanel({ hustle }) {
  const Icon = hustle.icon;
  const colors = colorMap[hustle.color];

  return (
    <div data-testid="hustle-detail-panel" className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
      <div className={`${colors.bg} px-8 py-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm`}>
            <Icon size={28} className={colors.icon} />
          </div>
          <div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[hustle.category]}`}>
              {hustle.category}
            </span>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 mt-1">{hustle.title}</h2>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">{hustle.description}</p>
      </div>

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <DollarSign size={20} className="text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 mb-0.5">Monthly Earning</p>
            <p className="font-semibold text-slate-900 text-sm">{hustle.earning}</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <Clock size={20} className="text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 mb-0.5">Time Required</p>
            <p className="font-semibold text-slate-900 text-sm">{hustle.timeCommitment}</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <Target size={20} className="text-amber-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 mb-0.5">Difficulty</p>
            <p className="font-semibold text-slate-900 text-sm">{hustle.difficulty}</p>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Zap size={18} className="text-blue-600" />
            Key Benefits
          </h3>
          <ul className="space-y-2">
            {hustle.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-xl p-5">
          <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
            <Briefcase size={16} />
            Best For
          </h4>
          <p className="text-blue-700 text-sm leading-relaxed">{hustle.bestFor}</p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <StarRating rating={hustle.rating} />
          <span className="text-sm text-slate-500">Recommendation score</span>
        </div>
      </div>
    </div>
  );
}

export default function SideHustlePage() {
  const [selected, setSelected] = useState(1);
  const selectedHustle = sideHustles.find((h) => h.id === selected);

  useSEO({
    title: "Side Hustle Ideas for Dental Professionals | Bright Smile Dental Care",
    description:
      "Discover the best side hustle opportunities for dentists and dental professionals. From online courses to consulting, find your perfect income stream.",
    keywords:
      "dentist side hustle, dental professional income, dental consulting, dental courses, locum dentist, dental content creator",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero */}
      <section data-testid="side-hustle-hero" className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm uppercase tracking-[0.2em] font-bold text-blue-600 mb-4 block">
            For Dental Professionals
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight font-medium text-slate-900 mb-5">
            Side Hustle Ideas
            <span className="block text-blue-600">That Actually Work</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Curated income opportunities for dentists who want to diversify beyond the chair.
            Each option rated by earning potential, time investment, and fit.
          </p>

          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-heading font-semibold text-slate-900">{sideHustles.length}</p>
              <p className="text-sm text-slate-500">Opportunities</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-heading font-semibold text-emerald-600">50K+</p>
              <p className="text-sm text-slate-500">Top Earning/mo</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-heading font-semibold text-blue-600">6</p>
              <p className="text-sm text-slate-500">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content — List + Detail */}
      <section data-testid="side-hustle-list" className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Card List */}
            <div className="lg:col-span-3 space-y-4">
              {sideHustles.map((h) => (
                <HustleCard
                  key={h.id}
                  hustle={h}
                  onSelect={setSelected}
                  isSelected={selected === h.id}
                />
              ))}
            </div>

            {/* Detail Panel (sticky on desktop) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                {selectedHustle && <DetailPanel hustle={selectedHustle} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-testid="side-hustle-cta" className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-white mb-4">
            Ready to Grow Beyond the Chair?
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Whether you choose one side hustle or combine several, the key is to start.
            Your clinical expertise is your unfair advantage — put it to work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              data-testid="side-hustle-contact-cta"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get in Touch
              <ArrowRight size={18} />
            </a>
            <a
              href="/services"
              data-testid="side-hustle-services-cta"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all backdrop-blur"
            >
              Our Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
