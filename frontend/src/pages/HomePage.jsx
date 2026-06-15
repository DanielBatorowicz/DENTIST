import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Hammer, Home, Box, Truck, Recycle, Shield,
  Clock, Award, Leaf, CheckCircle, Phone, ArrowRight, Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ── Real BSS photos — served locally from /public/photos/ ── */
const BSS = {
  fleet:      "/photos/hero.jpg",     // 3 BSS trucks (Mercedes, Renault, Scania) lined up at base
  driver:     "/photos/about.jpg",    // smiling BSS driver in truck cab
  waste:      "/photos/work1.jpg",    // red Mercedes truck next to cardboard/waste pile
  containers: "/photos/work2.jpg",    // blue BSS skip containers with logo and phone number
  building:   "/photos/truck1.jpg",   // BSS headquarters / Skawina base building (green facade)
  dispatch:   "/photos/truck2.jpg",   // BSS dispatchers at computer monitors in office
  team:       "/photos/office1.jpg",  // BSS office team at desks with fleet-tracking screens
  desk:       "/photos/office2.jpg",  // close-up of desk with BSS business card holder
};

const serviceSections = [
  {
    img: BSS.waste,
    label: "01 / Gruz i odpady budowlane",
    title: "Remontowi, budowlani, deweloperzy",
    desc: "Wywóz gruzu, ceramiki, ziemi i wszelkich odpadów budowlanych. Działamy szybko — możliwy odbiór już następnego dnia.",
    align: "left",
  },
  {
    img: BSS.fleet,
    label: "02 / Flota EURO 6",
    title: "Nowoczesne pojazdy, niezawodna obsługa",
    desc: "Całą flotą spełniamy normę EURO 6. Regularny serwis, GPS, pełne ubezpieczenie — każde zlecenie realizujemy bezpiecznie.",
    align: "right",
  },
  {
    img: BSS.containers,
    label: "03 / Kontenery Big-Bag",
    title: "Elastyczne Big-Bagi na odpady",
    desc: "Worki Big-Bag o pojemności 1 m³ — dostarczamy, odbieramy po zapełnieniu. Bez umowy, bez okresu minimalnego.",
    align: "left",
  },
  {
    img: BSS.building,
    label: "04 / Punkt odbioru — Skawina",
    title: "Przywieź sam, my utylizujemy",
    desc: "Baza ul. Tyniecka 1, Skawina — punkt odbioru odpadów budowlanych czynny Pon–Pt, 8:00–16:00. Szybko i bez kolejek.",
    align: "right",
  },
];

const stats = [
  { value: "30+", label: "Lat doświadczenia" },
  { value: "5 000+", label: "Zleceń rocznie" },
  { value: "EURO 6", label: "Norma floty" },
  { value: "100%", label: "Zgodność z prawem" },
];

const whyUs = [
  { icon: Award,   title: "30+ lat na rynku",       desc: "Od 1995 roku budujemy zaufanie klientów w Krakowie i okolicach." },
  { icon: Truck,   title: "Flota EURO 6",            desc: "Nowoczesne, ekologiczne pojazdy spełniające najwyższe normy emisji." },
  { icon: Clock,   title: "Szybka realizacja",       desc: "Odbiór w ciągu 24–48 h od zgłoszenia. Terminowość to nasz standard." },
  { icon: Leaf,    title: "Odpowiedzialność eco",    desc: "Segregujemy i przekazujemy odpady do recyklingu tam, gdzie to możliwe." },
  { icon: Shield,  title: "Pełne zezwolenia",        desc: "Wszystkie wymagane pozwolenia środowiskowe — działamy w 100% legalnie." },
  { icon: Recycle, title: "Dokumentacja na żądanie", desc: "Wystawiamy potwierdzenia odbioru i karty odpadów dla firm." },
];

const testimonials = [
  { name: "Marcin Kowalski",   role: "Deweloper, Kraków",         text: "BSS to sprawdzony partner przy każdej inwestycji. Wywóz gruzu zawsze na czas, bez problemów. Polecam każdemu.", rating: 5 },
  { name: "Anna Wiśniewska",   role: "Właścicielka domu, Podgórze", text: "Skorzystałam przy generalnym remoncie. Kontenery podstawione szybko, odbiór sprawny. Cena adekwatna do jakości.",  rating: 5 },
  { name: "Tomasz Nowak",      role: "Zarządca nieruchomości",    text: "Obsługują kilka moich wspólnot mieszkaniowych. Regularność i profesjonalizm wyróżniają BSS spośród innych firm.",  rating: 5 },
];

/* ── Helper: scroll-reveal wrapper ── */
function Reveal({ children, dir = "up", delay = 0, className = "" }) {
  const ref = useScrollReveal(delay);
  return (
    <div ref={ref} data-reveal={dir} className={className}>
      {children}
    </div>
  );
}

/* ── Counter component ── */
function Counter({ target, suffix = "" }) {
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const isNum = /^\d+$/.test(target);
        if (!isNum) { el.textContent = target + suffix; return; }
        const end = parseInt(target, 10);
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        let current = 0;
        const tick = () => {
          current = Math.min(current + step, end);
          el.textContent = current.toLocaleString("pl-PL") + (current === end ? suffix : "");
          if (current < end) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>{target}{suffix}</span>;
}

export default function HomePage() {
  useSEO({
    title: "BSS Kraków | Wywóz i Utylizacja Odpadów — 30+ Lat Doświadczenia",
    description: "Profesjonalny wywóz odpadów budowlanych, komunalnych i przemysłowych w Krakowie i okolicach. Nowoczesna flota EURO 6, szybka realizacja. Zadzwoń: +48 12 268 14 66",
    keywords: "wywóz odpadów Kraków, wywóz gruzu Kraków, kontenery na odpady, utylizacja odpadów budowlanych, Big-Bag Kraków, BSS Kraków",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ══════════════════════════════════════
          HERO — Ken Burns + slide-in text
      ══════════════════════════════════════ */}
      <section data-testid="hero-section" className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        {/* Ken Burns background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center ken-burns"
            style={{ backgroundImage: `url(${BSS.hero})` }}
          />
          {/* multi-layer overlay: bottom-heavy gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2.5 border border-green-400/50 bg-green-600/20 backdrop-blur-sm rounded-full px-5 py-2 mb-7 animate-fade-in-up"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-xs font-bold uppercase tracking-[0.2em]">
                Kraków i okolice · Działamy od 1995 r.
              </span>
            </div>

            <h1
              className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[0.92] tracking-tight mb-7 animate-fade-in-up animate-delay-100"
            >
              Wywóz odpadów<br />
              <span className="text-green-400">szybko i legalnie.</span>
            </h1>

            <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-9 max-w-xl animate-fade-in-up animate-delay-200">
              Gruz, papa, drewno, meble, odpady komunalne — odbieramy wszystko.
              Nowoczesna flota EURO 6, ponad 30 lat na rynku, pełna dokumentacja.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <a
                href="tel:+48122681466"
                className="btn-primary inline-flex items-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-bold px-9 py-4 rounded-full text-base transition-all"
              >
                <Phone size={18} />
                Zadzwoń teraz
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-white font-semibold border-2 border-white/25 hover:border-green-400/60 px-7 py-4 rounded-full transition-all"
              >
                Nasze usługi <ArrowRight size={17} />
              </Link>
            </div>

            {/* badges */}
            <div className="flex flex-wrap gap-x-7 gap-y-2 mt-9 animate-fade-in-up animate-delay-400">
              {["Pojazdy EURO 6", "Zezwolenia środowiskowe", "30 lat doświadczenia"].map(b => (
                <div key={b} className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce animate-fade-in-up animate-delay-500">
          <div className="w-px h-10 bg-white/30" />
          <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — counting numbers
      ══════════════════════════════════════ */}
      <section data-testid="stats-section" className="py-14 bg-[#0B2210]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} dir="up" delay={i * 100}
                className={`text-center px-4 ${i < stats.length - 1 ? "lg:border-r lg:border-white/10" : ""}`}
              >
                <p className="font-heading text-4xl md:text-5xl font-bold text-white mb-1.5">
                  <Counter target={s.value} />
                </p>
                <div className="w-5 h-px bg-green-500 mx-auto mb-2.5" />
                <p className="text-green-300/70 text-xs uppercase tracking-[0.15em] font-semibold">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICE SECTIONS — ekoline style
          Full-width photo + dark overlay + text
      ══════════════════════════════════════ */}
      {serviceSections.map((s, i) => (
        <section
          key={s.label}
          data-testid={`service-section-${i}`}
          className="relative min-h-[85vh] flex items-center overflow-hidden"
        >
          {/* Background photo */}
          <div className="absolute inset-0">
            <img
              src={s.img}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Gradient overlay — stronger on text side */}
            <div
              className={`absolute inset-0 ${
                s.align === "left"
                  ? "bg-gradient-to-r from-black/90 via-black/60 to-black/20"
                  : "bg-gradient-to-l from-black/90 via-black/60 to-black/20"
              }`}
            />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className={`max-w-xl ${s.align === "right" ? "ml-auto text-right" : ""}`}>
              <Reveal dir={s.align === "left" ? "left" : "right"} delay={0}>
                <span className="text-green-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
                  {s.label}
                </span>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.0] mb-5 tracking-tight">
                  {s.title}
                </h2>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  {s.desc}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border-b-2 border-green-400 text-green-400 hover:text-green-300 hover:border-green-300 font-semibold transition-colors pb-0.5"
                >
                  Dowiedz się więcej <ArrowRight size={16} />
                </Link>
              </Reveal>
            </div>
          </div>

          {/* Section number decoration */}
          <div className={`absolute bottom-8 ${s.align === "right" ? "left-8 lg:left-16" : "right-8 lg:right-16"} select-none pointer-events-none hidden lg:block`}>
            <span className="font-heading font-bold text-[8rem] leading-none text-white/[0.04]">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════
          ABOUT — split layout with reveal
      ══════════════════════════════════════ */}
      <section data-testid="about-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image — clip-path reveal */}
            <Reveal dir="left" delay={0} className="relative order-2 lg:order-1">
              <div className="clip-reveal rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img
                  src={BSS.driver}
                  alt="Realizacja zlecenia BSS — wywóz odpadów Kraków"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-green-600 text-white rounded-2xl shadow-xl px-6 py-5 text-center">
                <p className="font-heading text-3xl font-bold leading-none">30+</p>
                <p className="text-green-200 text-xs mt-1.5 leading-snug">lat na<br />rynku</p>
              </div>
            </Reveal>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <Reveal dir="right" delay={100}>
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                  <span className="text-green-700 text-xs font-bold uppercase tracking-widest">O firmie BSS</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-[1.0] tracking-tight">
                  Zaufany partner<br /><span className="text-gradient">od 1995 roku</span>
                </h2>
                <div className="space-y-4 text-slate-500 text-base leading-relaxed mb-8">
                  <p>
                    BSS to spółka jawna B. Bobek i J. Frączek — krakowska firma z ponad 30-letnim doświadczeniem w wywozie i utylizacji odpadów budowlanych, komunalnych i przemysłowych.
                  </p>
                  <p>
                    Dysponujemy nowoczesną flotą pojazdów EURO 6, posiadamy wszelkie zezwolenia środowiskowe i realizujemy zlecenia szybko, bezpiecznie i z pełną dokumentacją.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    "Pojazdy EURO 6", "Pełna dokumentacja",
                    "Zezwolenia środowiskowe", "Obsługa firm i osób prywatnych",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  to="/about"
                  className="btn-primary inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3.5 rounded-full transition-all"
                >
                  Poznaj nas <ArrowRight size={17} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY US — animated cards grid
      ══════════════════════════════════════ */}
      <section data-testid="why-us-section" className="py-24 bg-[#F5FBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal dir="up" className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Dlaczego BSS?</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Solidność, która mówi<br />sama za siebie
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} dir="up" delay={i * 80}
                className="bg-white rounded-2xl p-7 border border-green-100 card-hover group"
              >
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <item.icon size={22} className="text-green-600" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESS — dark, 3 steps
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#0B2210] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#22c55e 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal dir="up" className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/40 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Jak działamy</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight">
              Prosty proces w 3 krokach
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Zadzwoń lub napisz", desc: "Opisz rodzaj i ilość odpadów. Wyceniamy szybko, bez zobowiązań." },
              { num: "02", title: "Ustalamy termin",    desc: "Przyjeżdżamy punktualnie w uzgodnionym terminie — bez zbędnego czekania." },
              { num: "03", title: "Odbieramy i utylizujemy", desc: "Ładujemy, wystawiamy dokumenty i przekazujemy odpady do właściwej utylizacji." },
            ].map((step, i) => (
              <Reveal key={step.num} dir="up" delay={i * 120}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="font-heading text-6xl font-bold text-green-600/25 mb-4 leading-none">{step.num}</div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PHOTO STRIP — BSS photos gallery
      ══════════════════════════════════════ */}
      <section className="py-0 bg-slate-900 overflow-hidden">
        <div className="flex gap-0">
          {[BSS.waste, BSS.driver, BSS.building, BSS.team, BSS.containers, BSS.dispatch, BSS.desk].map((src, i) => (
            <div
              key={i}
              className="flex-1 min-w-0 relative overflow-hidden group"
              style={{ height: "320px" }}
            >
              <img
                src={src}
                alt={`Realizacja BSS ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section data-testid="testimonials-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal dir="up" className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Opinie klientów</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Co mówią o nas klienci
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} dir="up" delay={i * 100}
                className="bg-[#F5FBF5] rounded-2xl p-7 border border-green-100 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5 italic">„{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-green-100">
                  <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — full-bleed with BSS truck photo
      ══════════════════════════════════════ */}
      <section data-testid="cta-section" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={BSS.fleet} alt="Flota BSS" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-green-900/88" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal dir="up">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
              Potrzebujesz wywozu odpadów?
            </h2>
            <p className="text-green-100 text-base leading-relaxed mb-10 max-w-lg mx-auto">
              Zadzwoń lub napisz — wyceniamy szybko, działamy sprawnie, bez zbędnych formalności.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+48122681466"
                className="btn-dark inline-flex items-center justify-center gap-2.5 bg-white hover:bg-green-50 text-green-900 font-bold px-10 py-4 rounded-full transition-all text-base"
              >
                <Phone size={18} />
                +48 12 268 14 66
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white/60 font-semibold px-9 py-4 rounded-full transition-all"
              >
                Napisz do nas <ArrowRight size={17} />
              </Link>
            </div>
            <p className="text-green-300/70 text-sm mt-7">
              Pon–Pt 8:00–16:00 · biuro@bss.krakow.pl
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
