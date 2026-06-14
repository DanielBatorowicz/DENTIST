import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Truck } from "lucide-react";

const navLinks = [
  { label: "Strona główna", path: "/" },
  { label: "O firmie", path: "/about" },
  { label: "Usługi", path: "/services" },
  { label: "FAQ", path: "/faq" },
  { label: "Kontakt", path: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        data-testid="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/97 backdrop-blur-xl shadow-md border-b border-green-100"
            : "bg-white/90 backdrop-blur-xl border-b border-green-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3.5">
            {/* Logo */}
            <Link to="/" data-testid="header-logo" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Truck size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-heading text-2xl font-bold text-slate-900 group-hover:text-green-700 transition-colors tracking-tight">
                  BSS
                </span>
                <span className="block text-[10px] text-slate-500 font-body tracking-widest uppercase -mt-0.5">
                  Wywóz Odpadów · Kraków
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav data-testid="desktop-nav" className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-green-700 bg-green-50"
                      : "text-slate-600 hover:text-green-700 hover:bg-green-50/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+48122681466"
                data-testid="header-phone"
                className="flex items-center gap-2 text-slate-600 hover:text-green-700 text-sm transition-colors"
              >
                <Phone size={15} className="text-green-600" />
                <span className="font-semibold">+48 12 268 14 66</span>
              </a>
              <Link
                to="/contact"
                data-testid="header-contact-btn"
                className="btn-primary bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
              >
                Zamów Wywóz
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              data-testid="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            data-testid="mobile-menu"
            className="lg:hidden bg-white border-t border-green-50 px-4 py-4 shadow-lg"
          >
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-green-700 bg-green-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <a
                href="tel:+48122681466"
                className="flex items-center gap-2 text-slate-600 text-sm px-2"
              >
                <Phone size={15} className="text-green-600" />
                <span className="font-semibold">+48 12 268 14 66</span>
              </a>
              <Link
                to="/contact"
                data-testid="mobile-contact-btn"
                className="btn-primary bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-full w-full text-center transition-all"
              >
                Zamów Wywóz
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
