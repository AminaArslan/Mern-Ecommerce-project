'use client';
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    return (
        <main className="w-full bg-[#f0f0f0] pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-3 md:px-6 max-w-6xl">

                {/* HERO SECTION */}
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase block">
                        Get In Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-dark leading-none tracking-tighter">
                        Contact <span className="italic font-light text-gray-300">Us</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Have a question or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">

                    {/* CONTACT FORM */}
                    <div className="bg-white p-6 md:p-10 rounded-sm shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-serif text-dark mb-6">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-dark transition-colors"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-dark transition-colors"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-dark transition-colors"
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-dark transition-colors resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-dark text-white py-4 px-6 rounded-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FiSend size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="space-y-8">

                        {/* Contact Details */}
                        <div className="bg-white p-6 md:p-10 rounded-sm shadow-sm">
                            <h2 className="text-2xl md:text-3xl font-serif text-dark mb-8">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center shrink-0">
                                        <FiMail className="text-amber-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark mb-1">Email</h3>
                                        <a href="mailto:support@studioamina.com" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                                            support@studioamina.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center shrink-0">
                                        <FiPhone className="text-amber-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark mb-1">Phone</h3>
                                        <a href="tel:+923001234567" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                                            +92 300 1234567
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center shrink-0">
                                        <FiMapPin className="text-amber-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark mb-1">Address</h3>
                                        <p className="text-sm text-gray-600">
                                            Studio Amina Boutique<br />
                                            Fashion District, Lahore<br />
                                            Pakistan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-linear-to-br from-dark to-gray-800 text-white p-6 md:p-10 rounded-sm shadow-xl">
                            <h2 className="text-xl md:text-2xl font-serif mb-6">Business Hours</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                    <span className="text-gray-300">Monday - Friday</span>
                                    <span className="font-bold">9:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                    <span className="text-gray-300">Saturday</span>
                                    <span className="font-bold text-amber-400">Closed</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Sunday</span>
                                    <span className="font-bold text-amber-400">Closed</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
