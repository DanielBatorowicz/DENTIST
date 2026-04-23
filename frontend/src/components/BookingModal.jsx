import { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";

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
  "Other / General Inquiry",
];

const TIME_SLOTS = [
  "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

export default function BookingModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", preferred_date: "", preferred_time: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.service || !form.preferred_date) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/appointments`, form);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    setForm({ name: "", email: "", phone: "", service: "", preferred_date: "", preferred_time: "", message: "" });
    onClose();
  };

  return (
    <div
      data-testid="booking-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div
        data-testid="booking-modal"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-slate-900">Book an Appointment</h2>
            <p className="text-slate-500 text-sm mt-0.5">We'll confirm within 24 hours</p>
          </div>
          <button
            data-testid="booking-modal-close"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div data-testid="booking-success" className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-slate-900 mb-2">Request Received!</h3>
              <p className="text-slate-500 text-sm mb-6">
                Thank you, {form.name}. Our team will contact you within 24 hours to confirm your appointment.
              </p>
              <button
                data-testid="booking-success-close"
                onClick={handleClose}
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <form data-testid="booking-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div data-testid="booking-error" className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="booking-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="booking-phone"
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
                  data-testid="booking-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  data-testid="booking-service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="booking-date"
                    name="preferred_date"
                    type="date"
                    value={form.preferred_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Time</label>
                  <select
                    data-testid="booking-time"
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Any time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
                <textarea
                  data-testid="booking-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any concerns, previous dental history, or special requests..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <button
                data-testid="booking-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Request Appointment"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
