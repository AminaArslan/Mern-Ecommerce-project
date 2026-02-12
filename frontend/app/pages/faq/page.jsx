'use client';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: "Ordering",
            questions: [
                {
                    q: "How do I place an order?",
                    a: "Simply browse our collection, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
                },
                {
                    q: "Can I modify or cancel my order?",
                    a: "You can cancel your order within 24 hours of placing it if it hasn't been shipped yet. Please contact us immediately through our Contact page or email."
                },
                {
                    q: "Do you offer gift wrapping?",
                    a: "Yes! We offer complimentary gift wrapping for all orders. Simply select the gift wrap option during checkout."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    q: "What are your shipping options?",
                    a: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Shipping costs are calculated at checkout based on your location."
                },
                {
                    q: "Do you ship internationally?",
                    a: "Currently, we ship within Pakistan only. International shipping will be available soon. Stay tuned!"
                },
                {
                    q: "How can I track my order?",
                    a: "Once your order ships, you'll receive a tracking number via email. You can also track your order status in the 'My Orders' section of your account."
                }
            ]
        },
        {
            category: "Returns & Exchanges",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We accept returns within 7 days of delivery for unworn, unwashed items with original tags attached. Please contact us to initiate a return."
                },
                {
                    q: "How do I exchange an item?",
                    a: "To exchange an item, please contact our customer service team. We'll guide you through the exchange process and help you find the perfect replacement."
                },
                {
                    q: "Who pays for return shipping?",
                    a: "Return shipping costs are the customer's responsibility unless the item is defective or we made an error with your order."
                }
            ]
        },
        {
            category: "Payment",
            questions: [
                {
                    q: "What payment methods do you accept?",
                    a: "We accept Cash on Delivery (COD), credit/debit cards, and online payment methods through our secure payment gateway."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Absolutely! We use industry-standard encryption to protect your payment information. Your data is safe with us."
                },
                {
                    q: "Can I pay in installments?",
                    a: "Currently, we don't offer installment plans, but we're working on adding this option soon. Stay updated through our newsletter!"
                }
            ]
        },
        {
            category: "Products",
            questions: [
                {
                    q: "How do I know what size to order?",
                    a: "Each product page includes a detailed size guide. If you're unsure, feel free to contact us for personalized sizing assistance."
                },
                {
                    q: "Are your products authentic?",
                    a: "Yes! All our products are 100% authentic and sourced from trusted suppliers. We guarantee the quality of every piece."
                },
                {
                    q: "Do you restock sold-out items?",
                    a: "We try to restock popular items, but some pieces are limited edition. Sign up for notifications on product pages to be alerted when items are back in stock."
                }
            ]
        }
    ];

    const toggleFAQ = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full bg-[#f0f0f0] pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-3 md:px-6 max-w-4xl">

                {/* HERO SECTION */}
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase block">
                        Help Center
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-dark leading-none tracking-tighter">
                        Frequently Asked <span className="italic font-light text-gray-300">Questions</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Find answers to common questions about ordering, shipping, returns, and more.
                    </p>
                </div>

                {/* FAQ ACCORDION */}
                <div className="space-y-12">
                    {faqs.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-2xl md:text-3xl font-serif text-dark mb-6 pb-3 border-b-2 border-amber-400">
                                {category.category}
                            </h2>
                            <div className="space-y-4">
                                {category.questions.map((faq, qIndex) => {
                                    const index = `${catIndex}-${qIndex}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div
                                            key={qIndex}
                                            className="bg-white rounded-sm shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                                        >
                                            <button
                                                onClick={() => toggleFAQ(catIndex, qIndex)}
                                                className="w-full flex items-center justify-between p-4 md:p-6 text-left group"
                                            >
                                                <h3 className="text-sm md:text-base font-bold text-dark group-hover:text-amber-600 transition-colors pr-4">
                                                    {faq.q}
                                                </h3>
                                                <FiChevronDown
                                                    className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : ''
                                                        }`}
                                                    size={20}
                                                />
                                            </button>

                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}
                                            >
                                                <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                                                    <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-amber-400 pl-4">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* STILL HAVE QUESTIONS */}
                <div className="mt-20 bg-linear-to-br from-dark to-gray-800 text-white p-8 md:p-12 rounded-sm shadow-xl text-center">
                    <h2 className="text-2xl md:text-3xl font-serif mb-4">Still have questions?</h2>
                    <p className="text-gray-300 mb-6">
                        Can't find the answer you're looking for? Our customer support team is here to help.
                    </p>
                    <a
                        href="/pages/contact-us"
                        className="inline-block bg-amber-400 text-dark px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-amber-500 transition-all duration-300 shadow-lg"
                    >
                        Contact Us
                    </a>
                </div>

            </div>
        </div>
    );
}
