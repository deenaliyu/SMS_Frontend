import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const CONTACT_INFO = [
  { Icon: MapPin, label: "Address", value: "15 Education Crescent, Nassarawa GRA, Kano State, Nigeria" },
  { Icon: Phone, label: "Phone", value: "+234 801 234 5678" },
  { Icon: Mail, label: "Email", value: "info@wischool.edu.ng" },
  { Icon: Clock, label: "Office Hours", value: "Mon – Fri: 8:00 AM – 5:00 PM\nSat: 9:00 AM – 12:00 PM" },
];

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 bg-white placeholder:text-gray-400";

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSending(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="Contact Us"
        text="Have a question, concern, or just want to say hello? We'd love to hear from you. Our team responds within 24 hours."
        image="https://picsum.photos/seed/contact-hero/1600/600"
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info sidebar */}
          <div className="space-y-5">
            <div>
              <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">Get in Touch</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">We're Here to Help</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Whether you're a prospective parent, current student, or community member — our team is always available to assist.
              </p>
            </div>

            <div className="space-y-3">
              {CONTACT_INFO.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-gray-800 font-medium mt-0.5 whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-48">
              <iframe
                title="WiSchool Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2001251.996363329!2d7.1977604828396835!3d11.573686867157598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ac492941faebb7%3A0xb77211b27ef50cdb!2sKano!5e0!3m2!1sen!2sng!4v1738258150350!5m2!1sen!2sng"
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-sm cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send Us a Message</h2>
                <p className="text-gray-400 text-sm mb-6">Fill in the form and we'll respond as soon as possible.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name*</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First name" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name*</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last name" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address*</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="08XXXXXXXXX" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject*</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required className={inputCls + " cursor-pointer"}>
                      <option value="">Select a subject</option>
                      {["Admission Enquiry", "Student Records", "Fee Payment", "Academic Matters", "Events & Activities", "Other"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message*</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className={inputCls + " resize-none"}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" id="terms" required className="w-4 h-4 accent-green-600 cursor-pointer" />
                    <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                      I agree to WiSchool's privacy policy and consent to being contacted.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-60 text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-900/20"
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}