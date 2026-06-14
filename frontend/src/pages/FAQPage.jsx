import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Phone, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const faqs = [
  {
    q: "Jakie rodzaje odpadów odbiera firma BSS?",
    a: "Odbieramy gruz i odpady budowlane, odpady komunalne, drewno, papę i materiały pokryciowe, wełnę mineralną i styropian, meble i gabaryty oraz inne odpady niespecjalistyczne. Prowadzimy również punkt odbioru odpadów w Skawinie (ul. Tyniecka 1), gdzie możesz samodzielnie przywieźć odpady.",
  },
  {
    q: "Jak szybko możecie odebrać odpady?",
    a: "Staramy się realizować zlecenia w ciągu 24–48 godzin od kontaktu. W zależności od dostępności pojazdów i lokalizacji, termin może być jeszcze krótszy. W przypadku dużych zleceń lub regularnej obsługi ustalamy harmonogram indywidualnie.",
  },
  {
    q: "Jak zamówić wywóz odpadów?",
    a: "Najszybciej przez telefon — pod numerem +48 12 268 14 66 lub +48 12 357 14 36 (czynne Pon–Pt, 8:00–16:00). Możesz też napisać na adres biuro@bss.krakow.pl lub skorzystać z formularza kontaktowego na stronie. Chętnie wycenimy usługę i umówimy termin.",
  },
  {
    q: "Czy wywóz odpadów jest dokumentowany?",
    a: "Tak. Każde zlecenie jest dokumentowane zgodnie z obowiązującymi przepisami. Wystawiamy stosowne dokumenty potwierdzające odbiór i utylizację odpadów, co jest szczególnie ważne dla firm zobowiązanych do prowadzenia ewidencji odpadów.",
  },
  {
    q: "Czy obsługujecie klientów indywidualnych (prywatnych)?",
    a: "Tak, obsługujemy zarówno firmy (budowlane, deweloperów, wspólnoty mieszkaniowe, przedsiębiorstwa), jak i klientów prywatnych planujących remont, przeprowadzkę lub porządki. Cena zależy od ilości i rodzaju odpadów.",
  },
  {
    q: "Na jakim terenie działacie?",
    a: "Działamy przede wszystkim na terenie Krakowa i okolic — w tym powiatu krakowskiego, wielickiego i myślenickiego. W przypadku zleceń spoza tych rejonów prosimy o kontakt telefoniczny w celu ustalenia szczegółów.",
  },
  {
    q: "Co to są worki Big-Bag i jak je zamówić?",
    a: "Worki Big-Bag to duże pojemniki z tkaniny o pojemności 1 m³, idealne do zbierania gruzu i odpadów budowlanych. Dostarczamy je pod wskazany adres, a po zapełnieniu odbieramy na Twoje zlecenie. Zamów przez telefon lub formularz kontaktowy.",
  },
  {
    q: "Czy punkt w Skawinie przyjmuje wszystkie rodzaje odpadów?",
    a: "Punkt odbioru przy ul. Tynieckiej 1 w Skawinie przyjmuje odpady budowlane, gruz, drewno, papę i materiały izolacyjne. Nie przyjmujemy odpadów niebezpiecznych (np. azbestu, farb, olejów), substancji chemicznych ani odpadów medycznych. Czynny Pon–Pt, 8:00–16:00.",
  },
  {
    q: "Czy ceny są z góry ustalone?",
    a: "Ceny zależą od rodzaju, ilości i dostępności odpadów oraz od lokalizacji. Wyceniamy indywidualnie — bezpłatnie i bez zobowiązań. Skontaktuj się z nami, aby uzyskać konkretną ofertę.",
  },
  {
    q: "Czy możliwa jest stała, cykliczna obsługa firmy?",
    a: "Tak, obsługujemy wielu klientów w trybie cyklicznym — tygodniowym, dwutygodniowym lub miesięcznym. Dla stałych klientów oferujemy atrakcyjne warunki współpracy. Skontaktuj się, aby omówić szczegóły umowy.",
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all ${
        open ? "border-green-300 bg-green-50/50" : "border-slate-200 bg-white hover:border-green-200"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="font-heading font-bold text-green-600 text-sm w-6 flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-heading font-bold text-slate-900 text-base">{q}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-green-600 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-7 pb-6 pl-[4.25rem]">
          <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  useSEO({
    title: "FAQ — Najczęściej zadawane pytania | BSS Kraków Wywóz Odpadów",
    description: "Odpowiedzi na pytania dotyczące wywozu odpadów w Krakowie: jak zamówić, co odbieramy, tereny działania, dokumentacja, Big-Bag, punkt Skawina. BSS Kraków.",
    keywords: "FAQ wywóz odpadów Kraków, pytania BSS, jak zamówić wywóz gruzu, Big-Bag Kraków, punkt odbioru Skawina",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── PAGE HERO ── */}
      <section className="pt-20 bg-[#071A0E] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Pytania i odpowiedzi</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-6 tracking-tight">
              Masz pytania?<br />
              <span className="text-gradient-lime">Mamy odpowiedzi.</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Poniżej znajdziesz odpowiedzi na najczęściej zadawane pytania dotyczące naszych usług. Jeśli nie znajdziesz tego, czego szukasz — zadzwoń lub napisz.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ LIST ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STILL QUESTIONS ── */}
      <section className="py-20 bg-[#F5FBF5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Nie znalazłeś odpowiedzi?
          </h2>
          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Skontaktuj się z nami bezpośrednio — chętnie odpowiemy na wszystkie Twoje pytania i pomożemy dobrać odpowiednią usługę.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+48122681466"
              className="btn-primary inline-flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 text-white font-bold px-9 py-4 rounded-full transition-all"
            >
              <Phone size={17} />
              Zadzwoń: +48 12 268 14 66
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 text-slate-700 hover:text-green-700 border-2 border-slate-200 hover:border-green-300 font-semibold px-8 py-4 rounded-full transition-all"
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
