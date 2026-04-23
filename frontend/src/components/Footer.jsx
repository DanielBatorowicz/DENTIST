import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const services = [
  "General Dentistry",
  "Teeth Whitening",
  "Dental Implants",
  "Veneers",
  "Orthodontics",
  "Emergency Care",
];

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="bg-slate-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.5 2 6 4.5 6 7C6 8.5 6.5 9.8 7.2 10.8C7.8 11.6 8 12.5 8 13.5V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V13.5C16 12.5 16.2 11.6 16.8 10.8C17.5 9.8 18 8.5 18 7C18 4.5 15.5 2 12 2Z" fill="white"/>
                </svg>
              </div>
              <div>
                <span className="font-heading text-xl font-semibold">Bright Smile</span>
                <span className="block text-xs text-slate-400 -mt-0.5">Dental Care</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Your trusted partner for a lifetime of healthy, beautiful smiles. Providing compassionate, expert dental care since 2008.
            </p>
            <div className="flex gap-3">
              <a href="#" data-testid="footer-facebook" aria-label="Facebook" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#" data-testid="footer-instagram" aria-label="Instagram" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" data-testid="footer-twitter" aria-label="Twitter" className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Our Services", path: "/services" },
                { label: "FAQ", path: "/faq" },
                { label: "Contact Us", path: "/contact" },
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
            <h4 className="font-heading text-lg font-semibold mb-5">Our Services</h4>
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
            <h4 className="font-heading text-lg font-semibold mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">12 Harley Street<br />London W1G 9PG, UK</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400 flex-shrink-0" />
                <a href="tel:+442071234567" className="text-slate-400 hover:text-white text-sm transition-colors">
                  +44 (0) 20 7123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <a href="mailto:info@brightsmiledental.co.uk" className="text-slate-400 hover:text-white text-sm transition-colors">
                  info@brightsmiledental.co.uk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-slate-400 text-sm">
                  <p>Mon – Fri: 8:30am – 6:00pm</p>
                  <p>Saturday: 9:00am – 2:00pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Bright Smile Dental Care. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
