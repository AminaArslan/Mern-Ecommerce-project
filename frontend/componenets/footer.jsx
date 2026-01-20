'use client';

import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light relative z-50">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-accent mb-3">MyStore</h2>
          <p className="text-secondary text-sm">
            Premium clothing store for men, women & kids. Stylish, trendy & high quality.
          </p>

          <div className="flex space-x-3 mt-4">
            <a href="#" className="bg-accent p-2 rounded hover:bg-primary transition">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="bg-accent p-2 rounded hover:bg-primary transition">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="bg-accent p-2 rounded hover:bg-primary transition">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="bg-accent p-2 rounded hover:bg-primary transition">
              <FaPinterestP size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-accent">Quick Links</h3>
          <ul className="space-y-2 text-secondary text-sm">
            <li><a href="/products" className="hover:text-light transition">Shop</a></li>
            <li><a href="/about" className="hover:text-light transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-light transition">Contact</a></li>
            <li><a href="/privacy" className="hover:text-light transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-accent">Customer Service</h3>
          <ul className="space-y-2 text-secondary text-sm">
            <li><a href="#" className="hover:text-light transition">FAQ</a></li>
            <li><a href="#" className="hover:text-light transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-light transition">Track Order</a></li>
            <li><a href="#" className="hover:text-light transition">Support</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-accent">Join Our Newsletter</h3>
          <p className="text-secondary text-sm mb-3">
            Get the latest updates and offers.
          </p>
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded border border-secondary bg-dark text-light focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="bg-accent text-light px-4 py-2 rounded hover:bg-primary transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary mt-8 py-4 text-center text-sm text-secondary">
        &copy; {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
}
