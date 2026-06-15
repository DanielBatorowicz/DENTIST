import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Truck } from "lucide-react";

const services = [
  "Gruz i odpady budowlane",
  "Odpady komunalne",
  "Drewno i odpady drzewne",
  "Papa i materiały pokryciowe",
  "Materiały termoizolacyjne",
  "Meble i gabaryty",
  "Kontenery Big-Bag",
];

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="bg-[#071A0E] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <div>
                <span className="font-heading text-2xl font-bold tracking-tight">BSS</span>
                <span className="block text-[10px] text-green-400 tracking-widest uppercase -mt-0.5">Wywóz Odpadów</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Profesjonalny wywóz i utylizacja odpadów dla firm i osób prywatnych w Krakowie i okolicach. Ponad 30 lat doświadczenia.
            </p>
            <div className="flex gap-2.5">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-facebook"
                aria-label="Facebook"
                className="w-9 h-9 bg-white/5 hover:bg-green-700 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-bold mb-5 uppercase tracking-widest text-green-400">Nawigacja</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Strona główna", path: "/" },
                { label: "O firmie", path: "/about" },
                { label: "Nasze usługi", path: "/services" },
                { label: "FAQ", path: "/faq" },
                { label: "Kontakt", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-base font-bold mb-5 uppercase tracking-widest text-green-400">Usługi</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    data-testid={`footer-service-${s.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-bold mb-5 uppercase tracking-widest text-green-400">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-slate-400 text-sm">
                  <p className="font-medium text-slate-300 mb-0.5">Biuro:</p>
                  <p>ul. Montwiłła-Mireckiego 3</p>
                  <p>30-426 Kraków</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-slate-400 text-sm">
                  <p className="font-medium text-slate-300 mb-0.5">Baza:</p>
                  <p>ul. Tyniecka 1</p>
                  <p>32-050 Skawina</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-green-500 flex-shrink-0" />
                <div className="text-sm">
                  <a href="tel:+48122681466" className="text-slate-400 hover:text-white transition-colors block">+48 12 268 14 66</a>
                  <a href="tel:+48123571436" className="text-slate-400 hover:text-white transition-colors block">+48 12 357 14 36</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-green-500 flex-shrink-0" />
                <a href="mailto:biuro@bss.krakow.pl" className="text-slate-400 hover:text-white text-sm transition-colors">
                  biuro@bss.krakow.pl
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-slate-400 text-sm">
                  <p>Pon – Pt: 8:00 – 16:00</p>
                  <p>Sob – Nd: Nieczynne</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} B. Bobek, J. Frączek Spółka Jawna. NIP: 679-10-14-940
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Polityka prywatności</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
