import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

const faqs = [
  {
    id: "faq-1",
    question: "How often should I visit the dentist?",
    answer: "We recommend visiting every six months for a routine check-up and professional cleaning. However, patients with a history of gum disease, dental decay, or other oral health issues may benefit from more frequent visits. During your first appointment, Dr. Carter will advise on the most appropriate recall interval for your individual needs.",
  },
  {
    id: "faq-2",
    question: "Do you accept new patients?",
    answer: "Yes, we warmly welcome new patients of all ages, including families with children. You can book an appointment online using our booking form, call us directly, or visit us at our Harley Street practice. We aim to offer new patient appointments within 5 working days.",
  },
  {
    id: "faq-3",
    question: "What should I do in a dental emergency?",
    answer: "If you're experiencing a dental emergency — such as severe toothache, a broken tooth, a knocked-out tooth, or a lost filling — please call us immediately on +44 (0) 20 7123 4567. We keep emergency appointment slots available each day and aim to see urgent cases on the same day. Outside of clinic hours, you can contact NHS 111 for advice.",
  },
  {
    id: "faq-4",
    question: "Do you offer cosmetic dentistry?",
    answer: "Yes, we offer a comprehensive range of cosmetic dental treatments including teeth whitening, porcelain veneers, composite bonding, smile design, and Invisalign clear aligners. We recommend starting with a cosmetic consultation so Dr. Carter can understand your goals and recommend the most suitable treatment options.",
  },
  {
    id: "faq-5",
    question: "Is teeth whitening safe?",
    answer: "Yes — when performed or supervised by a qualified dental professional, teeth whitening is safe and effective. We use clinically approved whitening agents at appropriate concentrations. We'll always check your teeth and gums are healthy before starting any whitening treatment. Some patients experience mild, temporary sensitivity, which usually resolves within 24–48 hours.",
  },
  {
    id: "faq-6",
    question: "Do you treat children?",
    answer: "Yes, we provide friendly, gentle dental care for children from their first teeth through to their teenage years. We believe it's important for children to develop a positive relationship with dental care from an early age. Our practice is welcoming to families, and we take extra care to ensure children feel at ease.",
  },
  {
    id: "faq-7",
    question: "How much does dental treatment cost?",
    answer: "Treatment costs vary depending on the procedure. We provide detailed treatment plans with clear, itemised pricing before commencing any treatment so you know exactly what to expect. We believe in complete transparency and never charge hidden fees. We also offer 0% finance options for larger treatments — ask our team for details.",
  },
  {
    id: "faq-8",
    question: "I'm nervous about visiting the dentist — can you help?",
    answer: "Absolutely. Dental anxiety is extremely common and something we take very seriously. Dr. Carter has extensive experience working with nervous patients and will always take time to listen, explain every step in advance, and work at a pace you're comfortable with. We offer a calm, unhurried environment, and are happy to discuss sedation options for patients with significant anxiety.",
  },
  {
    id: "faq-9",
    question: "Do you offer dental implants?",
    answer: "Yes, we provide full dental implant treatments, from single-tooth replacements to full-arch restorations. Dr. Carter will carry out a thorough assessment including a 3D CBCT scan to determine your suitability and create a tailored implant plan. We also offer bone grafting where required.",
  },
  {
    id: "faq-10",
    question: "What are your payment and finance options?",
    answer: "We accept all major credit and debit cards, bank transfers, and cash. We offer 0% interest-free finance over 12 months for treatments over £500, and longer-term finance options are also available. Please speak with our reception team to discuss a payment plan that suits your budget.",
  },
];

export default function FAQPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Hero */}
      <section data-testid="faq-hero" className="pt-28 pb-16 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Patient Information</p>
          <h1 className="font-heading text-5xl md:text-6xl font-medium text-slate-900 mb-5">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to the most common questions about our dental services, treatments, and appointments.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section data-testid="faq-section" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                data-testid={`faq-item-${idx}`}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-6 overflow-hidden"
              >
                <AccordionTrigger
                  data-testid={`faq-trigger-${idx}`}
                  className="text-left font-body font-semibold text-slate-900 text-base py-5 hover:text-blue-600 hover:no-underline transition-colors"
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  data-testid={`faq-answer-${idx}`}
                  className="text-slate-600 text-sm leading-relaxed pb-5"
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Still have questions? */}
      <section data-testid="faq-contact-cta" className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-slate-900 mb-4">
            Still Have a Question?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-7 max-w-xl mx-auto">
            Our friendly team is happy to help. Contact us directly or book a consultation and we'll answer all your questions in person.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-testid="faq-book-btn"
              onClick={() => setBookingOpen(true)}
              className="btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all"
            >
              Book a Consultation
            </button>
            <a
              href="/contact"
              data-testid="faq-contact-link"
              className="flex items-center justify-center text-slate-700 hover:text-blue-600 font-semibold px-8 py-4 rounded-full border-2 border-slate-200 hover:border-blue-200 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
