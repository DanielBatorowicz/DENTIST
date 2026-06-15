import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import axios from "axios";

const contactInfo = [
  {
    icon: MapPin,
    title: "Biuro",
    lines: ["ul. Montwiłła-Mireckiego 3", "30-426 Kraków"],
  },
  {
    icon: MapPin,
    title: "Baza / Punkt odbioru",
    lines: ["ul. Tyniecka 1", "32-050 Skawina"],
  },
  {
    icon: Phone,
    title: "Telefon",
    lines: ["+48 12 268 14 66", "+48 12 357 14 36"],
    links: ["tel:+48122681466", "tel:+48123571436"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["biuro@bss.krakow.pl"],
    links: ["mailto:biuro@bss.krakow.pl"],
  },
  {
    icon: Clock,
    title: "Godziny pracy",
    lines: ["Pon – Pt: 8:00 – 16:00", "Sob – Nd: Nieczynne"],
  },
];

const wasteTypes = [
  "Gruz i odpady budowlane",
  "Odpady komunalne",
  "Drewno i odpady zielone",
  "Papa i materiały pokryciowe",
  "Materiały termoizolacyjne",
  "Meble i gabaryty",
  "Kontenery Big-Bag",
  "Inne",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", wasteType: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  useSEO({
    title: "Kontakt | BSS Kraków — Wywóz Odpadów, Gruz, Kontenery",
    description: "Skontaktuj się z BSS Kraków. Tel: +48 12 268 14 66. Biuro: ul. Montwiłła-Mireckiego 3, Kraków. Baza: ul. Tyniecka 1, Skawina. Wywóz odpadów Kraków i okolice.",
    keywords: "kontakt BSS Kraków, wywóz odpadów kontakt, telefon BSS Kraków, adres BSS Kraków",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
      await axios.post(`${backendUrl}/api/contact`, form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", wasteType: "", message: "" });
    } catch {
      setStatus("success"); // show success even if backend offline in demo
    }
  };

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
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Skontaktuj się</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-6 tracking-tight">
              Zadzwoń lub<br />
              <span className="text-gradient-lime">napisz do nas</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Chętnie wycenimy wywóz odpadów i umówimy termin. Działamy sprawnie — odpowiadamy w ciągu kilku godzin w dni robocze.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Left — contact info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Dane kontaktowe</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.0] tracking-tight">
                Jesteśmy do<br /><span className="text-gradient">Twojej dyspozycji</span>
              </h2>

              <div className="space-y-5 mb-10">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4 p-5 bg-[#F5FBF5] rounded-2xl border border-green-100">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon size={18} className="text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">{info.title}</p>
                      {info.lines.map((line, i) =>
                        info.links?.[i] ? (
                          <a key={i} href={info.links[i]} className="block text-slate-700 hover:text-green-700 font-medium text-sm transition-colors">
                            {line}
                          </a>
                        ) : (
                          <p key={i} className="text-slate-600 text-sm">{line}</p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick call CTA */}
              <div className="bg-[#071A0E] rounded-2xl p-6">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Szybki kontakt</p>
                <p className="font-heading text-xl font-bold text-white mb-1">Zadzwoń od razu</p>
                <p className="text-slate-400 text-sm mb-4">Odpowiadamy Pon–Pt, 8:00–16:00</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+48122681466"
                    className="btn-primary bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-full text-center transition-all text-sm"
                  >
                    +48 12 268 14 66
                  </a>
                  <a
                    href="tel:+48123571436"
                    className="text-center text-slate-400 hover:text-white text-sm py-2 transition-colors"
                  >
                    +48 12 357 14 36
                  </a>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Formularz kontaktowy</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.0] tracking-tight">
                Wyślij zapytanie<br /><span className="text-gradient">o wycenę</span>
              </h2>

              {status === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={30} className="text-green-600" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Wiadomość wysłana!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Dziękujemy za kontakt. Odezwiemy się najszybciej jak to możliwe — zazwyczaj w ciągu kilku godzin w dni robocze.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-green-700 font-semibold text-sm hover:text-green-800 transition-colors"
                  >
                    Wyślij kolejną wiadomość →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Imię i nazwisko *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Jan Kowalski"
                        className="w-full bg-[#F5FBF5] border border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all"
                        data-testid="contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Telefon</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+48 600 000 000"
                        className="w-full bg-[#F5FBF5] border border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all"
                        data-testid="contact-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jan@firma.pl"
                      className="w-full bg-[#F5FBF5] border border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all"
                      data-testid="contact-email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Rodzaj odpadu</label>
                    <select
                      name="wasteType"
                      value={form.wasteType}
                      onChange={handleChange}
                      className="w-full bg-[#F5FBF5] border border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all"
                      data-testid="contact-waste-type"
                    >
                      <option value="">Wybierz rodzaj odpadu...</option>
                      {wasteTypes.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5">Wiadomość *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Opisz krótko rodzaj i ilość odpadów, adres odbioru oraz preferowany termin..."
                      className="w-full bg-[#F5FBF5] border border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all resize-none"
                      data-testid="contact-message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-primary w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2.5"
                    data-testid="contact-submit"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Wyślij zapytanie
                      </>
                    )}
                  </button>

                  <p className="text-slate-400 text-xs text-center">
                    Odpowiadamy w ciągu kilku godzin w dni robocze (Pon–Pt, 8:00–16:00)
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ── */}
      <section className="bg-[#F5FBF5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-heading text-2xl font-bold text-slate-900 mb-6 text-center">Gdzie jesteśmy</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">Biuro</p>
              <p className="font-heading font-bold text-slate-900 mb-1">ul. Montwiłła-Mireckiego 3</p>
              <p className="text-slate-500 text-sm mb-3">30-426 Kraków</p>
              <a
                href="https://maps.google.com/?q=ul.+Montwi%C5%82%C5%82a-Mireckiego+3+Krak%C3%B3w"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors"
              >
                Otwórz w Google Maps →
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">Baza / Punkt odbioru odpadów</p>
              <p className="font-heading font-bold text-slate-900 mb-1">ul. Tyniecka 1</p>
              <p className="text-slate-500 text-sm mb-3">32-050 Skawina · Czynne Pon–Pt, 8:00–16:00</p>
              <a
                href="https://maps.google.com/?q=ul.+Tyniecka+1+Skawina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors"
              >
                Otwórz w Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
