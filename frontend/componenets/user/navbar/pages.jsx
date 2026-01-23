import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

export default function PagesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button className="flex items-center gap-1 hover:text-accent transition cursor-pointer">
        Pages
        <FiChevronDown
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown List */}
      <ul
        className={`absolute top-full mt-7 w-40 bg-primary text-dark border border-deep rounded-b-lg shadow-lg overflow-hidden transition-all duration-200 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <li>
          <Link
            href="/pages/about-us"
            className=" mt-2 block px-4 py-3 text-sm hover:bg-accent hover:text-light transition border-b"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            href="/pages/contact-us"
            className="block px-4 py-3 text-sm hover:bg-accent hover:text-light transition border-b"
          >
            Contact Us
          </Link>
        </li>
        <li>
          <Link
            href="/pages/faq"
            className="block px-4 py-3 text-sm hover:bg-accent hover:text-light transition"
          >
            FAQ
          </Link>
        </li>
      </ul>
    </div>
  );
}
