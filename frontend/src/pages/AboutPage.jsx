import { Link } from "react-router-dom";
import {
  Truck, Leaf, Shield, Award, Users, CheckCircle,
  Phone, ArrowRight, Clock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const values = [
  {
    icon: Shield,
    title: "Rzetelność",
    desc: "Dotrzymujemy ustalonych terminów i warunków. Nasi klienci wiedzą, że mogą na nas polegać.",
  },
  {
    icon: Leaf,
    title: "Odpowiedzialność ekologiczna",
    desc: "Dbamy o właściwą utylizację odpadów i segregację tam, gdzie to możliwe. Środowisko ma dla nas znaczenie.",
  },
  {
    icon: Award,
    title: "Profesjonalizm",
    desc: "Wyszkolona ekipa, nowoczesny sprzęt i aktualne zezwolenia — to standard każdego naszego zlecenia.",
  },
  {
    icon: Users,
    title: "Obsługa klienta",
    desc: "Podchodzimy do każdego zlecenia indywidualnie. Zawsze dostosowujemy się do Twoich potrzeb i harmonogramu.",
  },
];

const milestones = [
  { year: "1995", title: "Założenie firmy", desc: "B. Bobek i J. Frączek zakładają spółkę jawną w Krakowie. Pierwsze zlecenia dla lokalnych budów." },
  { year: "2000", title: "Rozbudowa floty", desc: "Firma rozszerza flotę pojazdów i zaczyna obsługiwać duże inwestycje deweloperskie w Krakowie." },
  { year: "2010", title: "Baza w Skawinie", desc: "Uruchomienie punktu odbioru odpadów w Skawinie (ul. Tyniecka 1) — obsługa klientów z Krakowa i okolic." },
  { year: "2020", title: "Flota EURO 6", desc: "Modernizacja całej floty do najnowszych norm emisji EURO 6 — ekologicznie i nowocześnie." },
  { year: "2025", title: "30 lat na rynku", desc: "Świętujemy jubileusz 30 lat obecności na krakowskim rynku usług odpadowych. Tysiące obsłużonych klientów." },
];

const fleet = [
  { name: "Pojazdy wywrotka", capacity: "10–20 ton", count: "Kilka jednostek" },
  { name: "Śmieciarki komunalne", capacity: "8–15 m³", count: "Kilka jednostek" },
  { name: "Pojazdy z HDS", capacity: "Do 10 ton", count: "Kilka jednostek" },
  { name: "Kontenery Big-Bag", capacity: "1 m³", count: "W stałej dyspozycji" },
];

export default function AboutPage() {
  useSEO({
    title: "O firmie BSS | Historia i wartości | Wywóz Odpadów Kraków",
    description: "Poznaj firmę BSS — profesjonalny wywóz odpadów w Krakowie od 1995 roku. Spółka B. Bobek, J. Frączek. Nowoczesna flota EURO 6, pełne zezwolenia.",
    keywords: "BSS Kraków historia, firma wywóz odpadów Kraków, B. Bobek J. Frączek spółka jawna",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── PAGE HERO ── */}
      <section className="pt-20 bg-[#071A0E] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=1920&q=80"
            alt="Flota pojazdów BSS"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071A0E]/80 to-[#071A0E]/95" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Nasza historia</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-6 tracking-tight">
              Ponad 30 lat<br />
              <span className="text-gradient-lime">zaufania i jakości</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Firma BSS to spółka jawna B. Bobek i J. Frączek z siedzibą w Krakowie. Od 1995 roku świadczymy profesjonalne usługi wywozu i utylizacji odpadów dla firm i klientów indywidualnych.
            </p>
          </div>
        </div>
      </section>

      {/* ── ABOUT CONTENT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Kim jesteśmy</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-[1.0] tracking-tight">
                Lokalna firma,<br /><span className="text-gradient">globalna odpowiedzialność</span>
              </h2>
              <div className="space-y-4 text-slate-500 text-base leading-relaxed">
                <p>
                  BSS to firma z głęboko zakorzenionym poczuciem odpowiedzialności za środowisko i lokalną społeczność. Przez ponad trzy dekady zbudowaliśmy silną pozycję na rynku krakowskim jako wiarygodny partner w zarządzaniu odpadami.
                </p>
                <p>
                  Obsługujemy firmy budowlane, deweloperów, wspólnoty mieszkaniowe, przedsiębiorstwa produkcyjne i klientów indywidualnych. Każde zlecenie traktujemy z taką samą starannością — niezależnie od jego rozmiaru.
                </p>
                <p>
                  Nasza baza operacyjna zlokalizowana jest przy ul. Tynieckiej 1 w Skawinie, gdzie prowadzimy punkt odbioru odpadów. Biuro obsługi klienta mieści się przy ul. Montwiłła-Mireckiego 3 w Krakowie.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: "Rok założenia", value: "1995" },
                  { label: "NIP firmy", value: "679-10-14-940" },
                  { label: "Siedziba", value: "Kraków" },
                  { label: "Norma pojazdów", value: "EURO 6" },
                ].map((item) => (
                  <div key={item.label} className="bg-[#F5FBF5] rounded-xl p-4 border border-green-100">
                    <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-heading text-lg font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581094289810-adf5d25690e0?auto=format&fit=crop&w=800&q=80"
                  alt="Profesjonalny wywóz odpadów budowlanych w Krakowie"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-[#F5FBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Nasze wartości</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Na czym budujemy markę BSS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-green-100 card-hover group">
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <v.icon size={22} className="text-green-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Historia firmy</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              30 lat w kilku kamieniach milowych
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[3.5rem] top-0 bottom-0 w-px bg-green-100 hidden sm:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 sm:gap-8 items-start">
                  <div className="flex-shrink-0 w-24 text-right hidden sm:block">
                    <span className="font-heading font-bold text-green-600 text-lg">{m.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-green-600 rounded-full mt-1.5 border-4 border-green-100 relative z-10 hidden sm:block" />
                  <div className="flex-1 bg-[#F5FBF5] rounded-2xl p-5 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-heading font-bold text-green-600 text-sm sm:hidden">{m.year}</span>
                      <h3 className="font-heading font-bold text-slate-900 text-base">{m.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FLEET ── */}
      <section className="py-24 bg-[#071A0E] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#22c55e 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/40 rounded-full px-4 py-1.5 mb-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Nasz sprzęt</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.0] tracking-tight">
                Nowoczesna flota<br /><span className="text-gradient-lime">EURO 6</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Inwestujemy w nowoczesny sprzęt spełniający najwyższe normy emisji. Nasze pojazdy są regularnie serwisowane i ubezpieczone, co gwarantuje niezawodność każdego zlecenia.
              </p>
              <div className="space-y-3">
                {[
                  "Regularny serwis techniczny",
                  "Pełne ubezpieczenie OC i AC",
                  "Norma emisji EURO 6",
                  "Monitoring i dyspozytornia",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fleet.map((f) => (
                <div key={f.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-green-700/30 rounded-xl flex items-center justify-center mb-4">
                    <Truck size={18} className="text-green-400" />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-1 text-base">{f.name}</h3>
                  <p className="text-green-400 text-xs font-semibold mb-0.5">{f.capacity}</p>
                  <p className="text-slate-500 text-xs">{f.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-green-600 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Chcesz nawiązać współpracę?
          </h2>
          <p className="text-green-100 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Skontaktuj się z nami, a dopasujemy ofertę do Twoich potrzeb — bez względu na skalę zlecenia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+48122681466"
              className="btn-dark inline-flex items-center justify-center gap-2.5 bg-white hover:bg-green-50 text-green-800 font-bold px-9 py-4 rounded-full transition-all"
            >
              <Phone size={17} />
              Zadzwoń teraz
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white/60 font-semibold px-8 py-4 rounded-full transition-all"
            >
              Formularz kontaktowy <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
