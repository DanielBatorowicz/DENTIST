import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import BookingModal from "@/components/BookingModal";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
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
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100"
            : "bg-white/80 backdrop-blur-xl border-b border-slate-100/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <Link to="/" data-testid="header-logo" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.5 2 6 4.5 6 7C6 8.5 6.5 9.8 7.2 10.8C7.8 11.6 8 12.5 8 13.5V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V13.5C16 12.5 16.2 11.6 16.8 10.8C17.5 9.8 18 8.5 18 7C18 4.5 15.5 2 12 2Z" fill="white"/>
                </svg>
              </div>
              <div className="leading-tight">
                <span className="font-heading text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Bright Smile
                </span>
                <span className="block text-xs text-slate-500 font-body tracking-wide -mt-0.5">Dental Care</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav data-testid="desktop-nav" className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+442071234567"
                data-testid="header-phone"
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm transition-colors"
              >
                <Phone size={15} />
                <span className="font-medium">+44 (0) 20 7123 4567</span>
              </a>
              <button
                data-testid="header-book-btn"
                onClick={() => setBookingOpen(true)}
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
              >
                Book Appointment
              </button>
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
            className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 shadow-lg"
          >
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <a
                href="tel:+442071234567"
                className="flex items-center gap-2 text-slate-600 text-sm px-2"
              >
                <Phone size={15} className="text-blue-600" />
                +44 (0) 20 7123 4567
              </a>
              <button
                data-testid="mobile-book-btn"
                onClick={() => setBookingOpen(true)}
                className="btn-primary bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-full w-full transition-all"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </header>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
