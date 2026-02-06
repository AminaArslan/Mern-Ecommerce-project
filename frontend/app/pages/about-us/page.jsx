'use client';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AboutUsPage() {
    return (
        <main className="w-full bg-[#f0f0f0] pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-3 md:px-6 max-w-6xl">

                {/* HERO SECTION */}
                <div className="text-center mb-24 space-y-6">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase block">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-dark leading-none tracking-tighter">
                        About <span className="italic font-light text-gray-300">Studio Amina</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        A curated collection of timeless pieces, crafted with passion and dedication to bring elegance to your wardrobe.
                    </p>
                </div>

                {/* BRAND STORY */}
                <div className="bg-white p-6 md:p-12 rounded-sm shadow-sm mb-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif text-dark mb-6">Our Journey</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Studio Amina was born from a passion for timeless fashion and a commitment to quality craftsmanship.
                                We believe that clothing is more than just fabric—it's an expression of individuality, confidence, and style.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Every piece in our collection is carefully curated to bring you the perfect blend of contemporary design
                                and classic elegance. From the initial sketch to the final stitch, we ensure that each garment meets our
                                exacting standards of quality and beauty.
                            </p>
                        </div>
                    </div>
                </div>

                {/* MISSION & VALUES */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
                    <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400/20 transition-all">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-xl font-serif text-dark mb-4">Our Mission</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            To empower individuals through fashion by providing high-quality, stylish pieces that inspire confidence and self-expression.
                        </p>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400/20 transition-all">
                            <span className="text-2xl">💎</span>
                        </div>
                        <h3 className="text-xl font-serif text-dark mb-4">Quality First</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            We never compromise on quality. Each piece is crafted with premium materials and meticulous attention to detail.
                        </p>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-400/20 transition-all">
                            <span className="text-2xl">🌟</span>
                        </div>
                        <h3 className="text-xl font-serif text-dark mb-4">Timeless Style</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Our designs transcend fleeting trends, offering pieces that remain elegant and relevant season after season.
                        </p>
                    </div>
                </div>

                {/* WHY CHOOSE US */}
                <div className="bg-linear-to-br from-dark to-gray-800 text-white p-8 md:p-16 rounded-sm shadow-xl mb-16">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-5xl font-serif mb-8">Why Choose Studio Amina?</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-amber-400 text-xl">✓</span>
                                    <div>
                                        <h4 className="font-bold mb-1">Premium Quality</h4>
                                        <p className="text-sm text-gray-300">Handpicked fabrics and materials</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-amber-400 text-xl">✓</span>
                                    <div>
                                        <h4 className="font-bold mb-1">Unique Designs</h4>
                                        <p className="text-sm text-gray-300">Exclusive collections you won't find elsewhere</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-amber-400 text-xl">✓</span>
                                    <div>
                                        <h4 className="font-bold mb-1">Customer Focused</h4>
                                        <p className="text-sm text-gray-300">Exceptional service and support</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-amber-400 text-xl">✓</span>
                                    <div>
                                        <h4 className="font-bold mb-1">Sustainable Practices</h4>
                                        <p className="text-sm text-gray-300">Committed to ethical fashion</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <a
                        href="/products"
                        className="inline-block bg-dark text-white px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Explore Our Collection
                    </a>
                </div>

            </div>
        </main>
    );
}
