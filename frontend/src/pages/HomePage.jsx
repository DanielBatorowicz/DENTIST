import { Link } from "react-router-dom";
import {
  Truck, Recycle, Shield, Clock, Award, Leaf,
  ChevronRight, Phone, CheckCircle, Star, ArrowRight,
  Hammer, Home, TreePine, Package, Layers, Box
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const services = [
  {
    icon: Hammer,
    title: "Gruz i odpady budowlane",
    desc: "Kompleksowy wywóz gruzu, odpadów remontowych i budowlanych. Obsługujemy zarówno duże inwestycje, jak i remonty domowe.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-100",
  },
  {
    icon: Home,
    title: "Odpady komunalne",
    desc: "Regularny lub jednorazowy wywóz odpadów komunalnych dla firm, wspólnot mieszkaniowych i klientów indywidualnych.",
    color: "bg-green-50",
    iconColor: "text-green-600",
    border: "border-green-100",
  },
  {
    icon: TreePine,
    title: "Drewno i odpady zielone",
    desc: "Utylizacja drewna, gałęzi, odpadów drzewnych i zielonych z ogrodów, budów i magazynów.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    icon: Layers,
    title: "Papa i materiały pokryciowe",
    desc: "Specjalistyczny wywóz papy, dachówek, materiałów pokryciowych zgodnie z przepisami środowiskowymi.",
    color: "bg-slate-50",
    iconColor: "text-slate-600",
    border: "border-slate-100",
  },
  {
    icon: Package,
    title: "Materiały termoizolacyjne",
    desc: "Bezpieczna utylizacja wełny mineralnej, styropianu i innych materiałów izolacyjnych.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: Box,
    title: "Kontenery Big-Bag",
    desc: "Dostarczamy worki Big-Bag na odpady budowlane i komunalne. Odbiór po zapełnieniu na Twoje zlecenie.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-violet-100",
  },
];

const whyUs = [
  { icon: Award, title: "30+ lat doświadczenia", desc: "Od ponad 30 lat obsługujemy Kraków i okolice — rzetelnie i profesjonalnie." },
  { icon: Truck, title: "Nowoczesna flota EURO 6", desc: "Pojazdy spełniające najwyższe normy emisji — ekologicznie i niezawodnie." },
  { icon: Clock, title: "Szybka realizacja", desc: "Sprawny odbiór odpadów w uzgodnionym terminie — bez zbędnego czekania." },
  { icon: Leaf, title: "Zgodność z przepisami", desc: "Posiadamy wszelkie zezwolenia i dbamy o właściwą utylizację każdego rodzaju odpadu." },
  { icon: Shield, title: "Pełne ubezpieczenie", desc: "Ubezpieczone pojazdy i ekipa. Twój majątek jest bezpieczny podczas każdego zlecenia." },
  { icon: Recycle, title: "Segregacja i recykling", desc: "Odpady są segregowane i przekazywane do recyklingu tam, gdzie to możliwe." },
];

const stats = [
  { value: "30+", label: "Lat na rynku" },
  { value: "5 000+", label: "Zrealizowanych zleceń" },
  { value: "100%", label: "Zgodność z prawem" },
  { value: "EURO 6", label: "Standard pojazdów" },
];

const testimonials = [
  {
    name: "Marcin Kowalski",
    role: "Deweloper, Kraków",
    text: "BSS to sprawdzony partner przy każdej inwestycji budowlanej. Wywóz gruzu zawsze na czas, bez problemów. Polecam każdemu, kto szuka solidnej firmy.",
    rating: 5,
  },
  {
    name: "Anna Wiśniewska",
    role: "Właścicielka domu, Podgórze",
    text: "Skorzystałam z usług BSS przy generalnym remoncie. Kontenery podstawione szybko, odbiór sprawny. Cena adekwatna do jakości — w pełni polecam!",
    rating: 5,
  },
  {
    name: "Tomasz Nowak",
    role: "Zarządca nieruchomości",
    text: "Obsługują kilka moich wspólnot mieszkaniowych. Regularność, punktualność i profesjonalizm to cechy, które wyróżniają BSS spośród innych firm.",
    rating: 5,
  },
  {
    name: "Katarzyna Zając",
    role: "Kierownik budowy",
    text: "Wieloletnia współpraca z BSS to gwarancja spokojnego placu budowy. Odpady znikają sprawnie, dokumentacja zawsze w porządku. Solidna firma.",
    rating: 5,
  },
];

export default function HomePage() {
  useSEO({
    title: "BSS Kraków | Wywóz i Utylizacja Odpadów — 30+ Lat Doświadczenia",
    description: "Profesjonalny wywóz odpadów budowlanych, komunalnych i przemysłowych w Krakowie i okolicach. Nowoczesna flota EURO 6, szybka realizacja. Zadzwoń: +48 12 268 14 66",
    keywords: "wywóz odpadów Kraków, wywóz gruzu Kraków, kontenery na odpady, utylizacja odpadów budowlanych, Big-Bag Kraków, BSS Kraków",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section
        data-testid="hero-section"
        className="pt-20 min-h-screen flex items-center relative overflow-hidden bg-[#071A0E]"
      >
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80"
            alt="Pojazd do wywozu odpadów"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A0E]/95 via-[#071A0E]/80 to-[#071A0E]/60" />
        </div>

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative w-full">
          <div className="max-w-3xl animate-fade-in-up">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-green-600/20 border border-green-500/30 rounded-full px-5 py-2 mb-8">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-[0.2em]">Kraków i okolice · Od 1995 roku</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[0.95] mb-7 tracking-tight">
              Wywóz odpadów<br />
              <span className="text-gradient-lime">szybko i legalnie.</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Profesjonalna firma z 30-letnim doświadczeniem. Obsługujemy firmy budowlane, deweloperów, wspólnoty mieszkaniowe i klientów indywidualnych w Krakowie i okolicach.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="tel:+48122681466"
                data-testid="hero-phone-btn"
                className="btn-primary bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2.5 text-base"
              >
                <Phone size={18} />
                Zadzwoń teraz
              </a>
              <Link
                to="/services"
                data-testid="hero-services-btn"
                className="flex items-center gap-2 text-white hover:text-green-300 font-semibold px-7 py-4 rounded-full border-2 border-white/20 hover:border-green-400/50 transition-all"
              >
                Nasze usługi <ChevronRight size={18} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-400 pt-8 border-t border-white/10">
              {[
                "Pojazdy EURO 6",
                "Zezwolenia środowiskowe",
                "Działamy od 1995 r.",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  <span className="font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating card */}
        <div className="absolute bottom-8 right-8 lg:right-16 hidden lg:block">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-green-100 w-64">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-green-700" />
              </div>
              <div>
                <p className="font-heading font-bold text-slate-900 text-sm">Szybka realizacja</p>
                <p className="text-slate-400 text-xs">W ciągu 24–48 godzin</p>
              </div>
            </div>
            <div className="space-y-2">
              {["Gruz budowlany", "Odpady komunalne", "Big-Bag kontenery"].map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle size={12} className="text-green-500" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section data-testid="stats-section" className="py-16 bg-green-600 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden hidden xl:block">
          <span className="font-heading font-bold text-[14rem] leading-none text-white/[0.07] tracking-tight">30+</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center px-4 ${i < stats.length - 1 ? "lg:border-r lg:border-white/20" : ""}`}>
                <p className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">{s.value}</p>
                <div className="w-6 h-0.5 bg-white/40 mx-auto mb-3 rounded-full" />
                <p className="text-green-100 text-xs uppercase tracking-[0.15em] font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section data-testid="intro-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">O firmie BSS</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.0] tracking-tight">
                Zaufany partner<br />
                <span className="text-gradient">w zarządzaniu odpadami</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-5">
                Firma BSS działa na rynku krakowskim od 1995 roku. Przez ponad 30 lat zbudowaliśmy reputację rzetelnego, profesjonalnego partnera w dziedzinie wywozu i utylizacji odpadów dla firm oraz klientów indywidualnych.
              </p>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Dysponujemy nowoczesną flotą pojazdów spełniających normę EURO 6, posiadamy wszelkie wymagane zezwolenia środowiskowe i realizujemy zlecenia szybko, bezpiecznie i zgodnie z obowiązującymi przepisami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  data-testid="intro-about-btn"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3.5 rounded-full btn-primary transition-all"
                >
                  Poznaj nas <ArrowRight size={17} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 text-slate-700 hover:text-green-700 font-semibold border-2 border-slate-200 hover:border-green-300 px-7 py-3.5 rounded-full transition-all"
                >
                  Skontaktuj się
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                  alt="Profesjonalny wywóz odpadów budowlanych"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent" />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-green-100">
                <p className="font-heading font-bold text-3xl text-green-700">30+</p>
                <p className="text-slate-500 text-xs mt-0.5">lat<br />doświadczenia</p>
              </div>
              <div className="absolute -top-5 -right-5 bg-[#071A0E] text-white rounded-2xl shadow-xl px-5 py-4 text-center">
                <p className="font-heading font-bold text-lg leading-none text-green-400">EURO 6</p>
                <p className="text-slate-400 text-xs mt-1">Norma<br />ekologiczna</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section data-testid="services-section" className="py-24 bg-[#F5FBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Co wywożąmy</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              Kompleksowe usługi<br />wywozu odpadów
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Gruz, meble, papa, izolacje, odpady komunalne i wiele więcej — odbieramy je sprawnie i bezpiecznie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={service.title}
                data-testid={`service-card-${i}`}
                className={`${service.color} rounded-2xl p-7 border ${service.border} card-hover group`}
              >
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-shadow`}>
                  <service.icon size={22} className={service.iconColor} />
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              data-testid="view-all-services-btn"
              className="inline-flex items-center gap-2 btn-primary bg-green-600 hover:bg-green-700 text-white font-semibold px-9 py-4 rounded-full transition-all"
            >
              Wszystkie usługi <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section data-testid="why-us-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Dlaczego BSS?</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-[1.0] tracking-tight">
                Solidność, która<br /><span className="text-gradient">mówi sama za siebie</span>
              </h2>
              <p className="text-slate-500 text-base mb-8 leading-relaxed max-w-md">
                Wybierając BSS, zyskujesz pewność, że odbiór odpadów przebiegnie sprawnie, legalnie i bez zbędnych formalności po Twojej stronie.
              </p>
              <a
                href="tel:+48122681466"
                className="btn-primary inline-flex items-center gap-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full transition-all"
              >
                <Phone size={17} />
                Zadzwoń i zapytaj
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map((item, idx) => (
                <div
                  key={item.title}
                  data-testid={`why-us-card-${idx}`}
                  className="bg-[#F5FBF5] rounded-2xl p-5 border border-green-100 card-hover group"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-green-50 border border-green-200 rounded-xl flex items-center justify-center mb-4 transition-colors shadow-sm">
                    <item.icon size={18} className="text-green-600" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-[#071A0E] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#22c55e 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/40 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Jak działamy</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Prosty proces w 3 krokach
            </h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">
              Zamawiasz — my przyjeżdżamy i odbieramy. Bez biurokracji, bez stresu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Zadzwoń lub napisz", desc: "Skontaktuj się z nami telefonicznie lub mailowo, opisz rodzaj i ilość odpadów. Wyceniamy szybko i bez zobowiązań." },
              { num: "02", title: "Ustalamy termin", desc: "Wspólnie ustalamy termin odbioru. Przyjeżdżamy punktualnie, bez zbędnego oczekiwania z Twojej strony." },
              { num: "03", title: "Odbieramy i utylizujemy", desc: "Ładujemy odpady, wystawiamy dokumentację i przekazujemy je do właściwej utylizacji lub recyklingu." },
            ].map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <div className="font-heading text-5xl font-bold text-green-600/30 mb-4 leading-none">{step.num}</div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section data-testid="testimonials-section" className="py-24 bg-[#F5FBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Opinie klientów</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Co mówią o nas klienci
            </h2>
          </div>

          {/* Featured testimonial */}
          <div
            data-testid="testimonial-card-0"
            className="bg-[#071A0E] rounded-3xl p-8 md:p-12 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="font-heading text-2xl md:text-3xl text-white leading-[1.35] italic mb-8 font-normal max-w-3xl">
                „{testimonials[0].text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.slice(1).map((t, idx) => {
              const avatarColors = ["bg-green-700", "bg-emerald-700", "bg-teal-700"];
              return (
                <div
                  key={t.name}
                  data-testid={`testimonial-card-${idx + 1}`}
                  className="bg-white rounded-2xl p-6 border border-green-100 shadow-[0_2px_16px_rgba(22,163,74,0.06)] flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">„{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-green-50">
                    <div className={`w-9 h-9 ${avatarColors[idx]} rounded-full flex items-center justify-center flex-shrink-0`}>
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
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-testid="cta-section" className="py-24 bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-700/30 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
            Potrzebujesz wywozu odpadów?
          </h2>
          <p className="text-green-100 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Skontaktuj się z nami już dziś. Wyceniamy szybko, działamy sprawnie — bez zbędnych formalności.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+48122681466"
              data-testid="cta-phone-btn"
              className="btn-dark inline-flex items-center justify-center gap-2.5 bg-white hover:bg-green-50 text-green-800 font-bold px-10 py-4 rounded-full transition-all text-base"
            >
              <Phone size={18} />
              +48 12 268 14 66
            </a>
            <Link
              to="/contact"
              data-testid="cta-contact-btn"
              className="inline-flex items-center justify-center gap-2 text-white hover:text-green-100 border-2 border-white/30 hover:border-white/60 font-semibold px-9 py-4 rounded-full transition-all"
            >
              Napisz do nas <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-green-200 text-sm mt-8">
            Pon–Pt, godz. 8:00–16:00 · biuro@bss.krakow.pl
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
