import { Link } from "react-router-dom";
import {
  Hammer, Home, TreePine, Layers, Package, Box,
  Truck, Sofa, CheckCircle, Phone, ArrowRight, Recycle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const services = [
  {
    icon: Hammer,
    title: "Gruz i odpady budowlane",
    desc: "Kompleksowy wywóz gruzu, odpadów remontowych i budowlanych. Obsługujemy zarówno duże inwestycje, jak i remonty domowe i mieszkaniowe.",
    details: [
      "Gruz ceglany, betonowy i mieszany",
      "Kafelki, glazura, terakota",
      "Ziemia, kamienie, piasek",
      "Folie budowlane i opakowania",
      "Drobny złom budowlany",
    ],
    image: "/photos/work1.jpg",
    accent: "amber",
  },
  {
    icon: Home,
    title: "Odpady komunalne",
    desc: "Regularny lub jednorazowy wywóz odpadów komunalnych dla firm, wspólnot mieszkaniowych i klientów indywidualnych na terenie Krakowa i okolic.",
    details: [
      "Zmieszane odpady komunalne",
      "Opakowania plastikowe i kartonowe",
      "Szkło i metale",
      "Organika z gastronomii",
      "Odpady biurowe",
    ],
    image: "/photos/work2.jpg",
    accent: "green",
  },
  {
    icon: TreePine,
    title: "Drewno i odpady zielone",
    desc: "Utylizacja drewna, gałęzi, odpadów drzewnych i zielonych z ogrodów, budów, magazynów i zakładów produkcyjnych.",
    details: [
      "Drewno nieimpregnowane i impregnowane",
      "Gałęzie, konary, pnie",
      "Trociny i wióry drzewne",
      "Skrzynki, palety drewniane",
      "Odpady z parków i ogrodów",
    ],
    image: "/photos/about.jpg",
    accent: "emerald",
  },
  {
    icon: Layers,
    title: "Papa i materiały pokryciowe",
    desc: "Specjalistyczny wywóz papy, dachówek, blachy dachowej i materiałów pokryciowych zgodnie z przepisami ochrony środowiska.",
    details: [
      "Papa bitumiczna i modyfikowana",
      "Dachówki ceramiczne i betonowe",
      "Blacha dachowa i blacho-dachówka",
      "Rynny i obróbki blacharskie",
      "Folie dachowe i paroizolacje",
    ],
    image: "/photos/truck1.jpg",
    accent: "slate",
  },
  {
    icon: Package,
    title: "Materiały termoizolacyjne",
    desc: "Bezpieczna utylizacja wełny mineralnej, styropianu i innych materiałów izolacyjnych wymagających specjalnego traktowania.",
    details: [
      "Styropian i wełna szklana",
      "Wełna kamienna i skalna",
      "Pianka poliuretanowa",
      "Keramzyt i perlita",
      "Płyty termoizolacyjne",
    ],
    image: "/photos/truck2.jpg",
    accent: "blue",
  },
  {
    icon: Sofa,
    title: "Meble i gabaryty",
    desc: "Wywóz starych mebli, sprzętu AGD i innych odpadów wielkogabarytowych z domów, biur i zakładów produkcyjnych.",
    details: [
      "Meble pokojowe i ogrodowe",
      "Materace i tapicerka",
      "Sprzęt AGD (bez freonów)",
      "Wyposażenie biurowe",
      "Dywany i wykładziny",
    ],
    image: "/photos/office1.jpg",
    accent: "violet",
  },
  {
    icon: Box,
    title: "Kontenery Big-Bag",
    desc: "Dostarczamy worki Big-Bag (1 m³) na odpady budowlane i komunalne. Odbiór po zapełnieniu na Twoje zlecenie — wygodnie i bez umowy.",
    details: [
      "Pojemność 1 m³",
      "Dostawa w Krakowie i okolicach",
      "Odbiór po wypełnieniu",
      "Brak opłaty za wynajem",
      "Możliwość zamówienia wielu worków",
    ],
    image: "/photos/hero.jpg",
    accent: "orange",
  },
  {
    icon: Truck,
    title: "Punkt odbioru odpadów — Skawina",
    desc: "Zapraszamy do naszej bazy w Skawinie (ul. Tyniecka 1), gdzie samodzielnie możesz przywieźć i oddać odpady budowlane i komunalne.",
    details: [
      "Odpady budowlane i gruz",
      "Drewno i odpady zielone",
      "Papa i dachówka",
      "Materiały izolacyjne",
      "Czynne Pon–Pt, 8:00–16:00",
    ],
    image: "/photos/office2.jpg",
    accent: "teal",
  },
];

const accentMap = {
  amber: { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  green: { bg: "bg-green-50", border: "border-green-100", icon: "text-green-600", badge: "bg-green-100 text-green-700" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  slate: { bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-600", badge: "bg-slate-100 text-slate-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  violet: { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
  orange: { bg: "bg-orange-50", border: "border-orange-100", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  teal: { bg: "bg-teal-50", border: "border-teal-100", icon: "text-teal-600", badge: "bg-teal-100 text-teal-700" },
};

export default function ServicesPage() {
  useSEO({
    title: "Usługi wywozu odpadów | BSS Kraków — Gruz, Komunalne, Big-Bag",
    description: "Kompleksowe usługi wywozu odpadów w Krakowie: gruz, odpady komunalne, drewno, papa, izolacje, meble, Big-Bag. Szybka realizacja, legalna utylizacja. BSS Kraków.",
    keywords: "wywóz gruzu Kraków, wywóz odpadów komunalnych, Big-Bag Kraków, punkt odbioru odpadów Skawina, utylizacja papy Kraków",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── PAGE HERO ── */}
      <section className="pt-20 bg-[#071A0E] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/photos/hero.jpg"
            alt="Wywóz odpadów BSS Kraków"
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
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Co wywożąmy</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-6 tracking-tight">
              Kompleksowe<br />
              <span className="text-gradient-lime">usługi odpadowe</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Od gruzu budowlanego po odpady komunalne — odbieramy wszystko, co chcesz usunąć. Legalnie, sprawnie i z pełną dokumentacją.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, i) => {
              const colors = accentMap[service.accent] || accentMap.green;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={service.title}
                  data-testid={`service-${i}`}
                  className={`${colors.bg} rounded-3xl overflow-hidden border ${colors.border}`}
                >
                  <div className={`grid lg:grid-cols-2 gap-0 ${isEven ? "" : "lg:grid-flow-dense"}`}>
                    {/* Image */}
                    <div className={`relative h-64 lg:h-auto min-h-[280px] overflow-hidden ${isEven ? "" : "lg:col-start-2"}`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Content */}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}>
                      <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm`}>
                        <service.icon size={22} className={colors.icon} />
                      </div>
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-3">{service.title}</h2>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.desc}</p>
                      <ul className="space-y-2">
                        {service.details.map((d) => (
                          <li key={d} className="flex items-center gap-2.5 text-sm text-slate-600">
                            <CheckCircle size={14} className={colors.icon + " flex-shrink-0"} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RECYCLING ── */}
      <section className="py-20 bg-[#F5FBF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Recycle size={30} className="text-green-600" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Segregacja i recykling
          </h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-2xl mx-auto">
            Dbamy o to, by odpady, które od Ciebie odbieramy, trafiły do właściwego miejsca — czy to do recyklingu, odzysku energii, czy bezpiecznego składowania. Posiadamy wymagane zezwolenia na transport i utylizację odpadów.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-green-600 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Nie wiesz, co możesz oddać?
          </h2>
          <p className="text-green-100 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Zadzwoń do nas — chętnie doradzimy i wycenimy usługę bezpłatnie, bez żadnych zobowiązań z Twojej strony.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+48122681466"
              className="btn-dark inline-flex items-center justify-center gap-2.5 bg-white hover:bg-green-50 text-green-800 font-bold px-9 py-4 rounded-full transition-all"
            >
              <Phone size={17} />
              +48 12 268 14 66
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white/60 font-semibold px-8 py-4 rounded-full transition-all"
            >
              Napisz do nas <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
