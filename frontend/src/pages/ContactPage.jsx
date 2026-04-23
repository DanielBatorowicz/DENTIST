import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import axios from "axios";
import useSEO from "@/hooks/useSEO";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SERVICES = [
  "General Dentistry",
  "Dental Check-up & Cleaning",
  "Teeth Whitening",
  "Dental Implants",
  "Veneers",
  "Orthodontics / Invisalign",
  "Root Canal Treatment",
  "Emergency Dental Care",
  "Pediatric Dentistry",
  "Cosmetic Dentistry",
  "Other",
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    lines: ["12 Harley Street", "London W1G 9PG, United Kingdom"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+44 (0) 20 7123 4567"],
    href: "tel:+442071234567",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@brightsmiledental.co.uk"],
    href: "mailto:info@brightsmiledental.co.uk",
  },
  {
    icon: Clock,
    label: "Opening Hours",
    lines: ["Mon – Fri: 8:30am – 6:00pm", "Saturday: 9:00am – 2:00pm", "Sunday: Closed"],
  },
];

export default function ContactPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useSEO({
    title: "Contact & Book Appointment | Bright Smile Dental Care London",
    description: "Contact Bright Smile Dental Care at 12 Harley Street, London W1G 9PG. Call +44 (0) 20 7123 4567 or book an appointment online. Same-day emergency slots available.",
    keywords: "contact dentist London, book dental appointment London, Harley Street dentist contact, dental emergency London, dental clinic address London",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/appointments`, {
        ...form,
        preferred_date: "",
        preferred_time: "",
      });
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Hero */}
      <section data-testid="contact-hero" className="pt-28 pb-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Get in Touch</p>
          <h1 className="font-heading text-5xl md:text-6xl font-medium text-slate-900 mb-5">Contact Us</h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out to book an appointment, ask a question, or simply find out how we can help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section data-testid="contact-info-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                data-testid={`contact-info-${info.label.toLowerCase().replace(/\s/g, "-")}`}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 card-hover"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <info.icon size={20} className="text-blue-600" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{info.label}</p>
                {info.lines.map((line, i) =>
                  info.href && i === 0 ? (
                    <a key={i} href={info.href} className="block text-slate-800 font-medium text-sm hover:text-blue-600 transition-colors">
                      {line}
                    </a>
                  ) : (
                    <p key={i} className="text-slate-600 text-sm">{line}</p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section data-testid="contact-form-section" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h2 className="font-heading text-3xl font-semibold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-slate-500 text-sm mb-7">We'll respond within one business day.</p>

              {success ? (
                <div data-testid="contact-success" className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={30} className="text-green-600" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">Thank you for reaching out. We'll be in touch shortly.</p>
                </div>
              ) : (
                <form data-testid="contact-form" onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div data-testid="contact-error" className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        data-testid="contact-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                      <input
                        data-testid="contact-phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+44 7xxx xxxxxx"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      data-testid="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Service of Interest</label>
                    <select
                      data-testid="contact-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select a service (optional)</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      data-testid="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    data-testid="contact-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map + Emergency */}
            <div className="flex flex-col gap-6">
              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-1 min-h-[300px]">
                <iframe
                  data-testid="contact-map"
                  title="Bright Smile Dental Care Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.828!2d-0.1490!3d51.5175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761acefb5b7b1d%3A0x9c4b0b0b0b0b0b0b!2sHarley%20Street%2C%20London!5e0!3m2!1sen!2suk!4v1620000000000"
                  width="100%"
                  height="100%"
                  style={{ minHeight: "300px", border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>

              {/* Emergency */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-red-800 mb-1">Dental Emergency?</h3>
                    <p className="text-red-700 text-sm mb-3">
                      For same-day emergency appointments, call us immediately. We keep urgent slots available every day.
                    </p>
                    <a
                      href="tel:+442071234567"
                      data-testid="emergency-call-btn"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
                    >
                      <Phone size={14} />
                      +44 (0) 20 7123 4567
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book appointment CTA */}
      <section data-testid="contact-book-cta" className="py-16 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="font-heading text-4xl font-medium text-white mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-slate-300 text-base mb-7 max-w-xl mx-auto">
            New patients are always welcome. Use our online booking system or call us — we'll find a time that works for you.
          </p>
          <button
            data-testid="contact-final-book-btn"
            onClick={() => setBookingOpen(true)}
            className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-9 py-4 rounded-full transition-all"
          >
            Book an Appointment
          </button>
        </div>
      </section>

      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
