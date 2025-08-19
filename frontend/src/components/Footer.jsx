// src/components/Footer.jsx
import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-primary-dark text-white">
    <div className="container mx-auto px-6 py-10">
      {/* Social Connect */}
      <div className="flex flex-col md:flex-row items-center justify-center mb-8">
        <span className="text-lg font-semibold mr-4 mb-4 md:mb-0">
          Connect with GovBuy:
        </span>
        <div className="flex space-x-6 text-xl">
          <a href="#" className="hover:text-gray-400"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-400"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-400"><FaLinkedinIn /></a>
        </div>
      </div>

      {/* Link Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* About GovBuy */}
        <div>
          <h6 className="uppercase font-semibold mb-4">About GovBuy</h6>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">Our Mission</a></li>
            <li><a href="/team" className="hover:underline">Team</a></li>
            <li><a href="/careers" className="hover:underline">Careers</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h6 className="uppercase font-semibold mb-4">Resources</h6>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/support" className="hover:underline">Help Center</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h6 className="uppercase font-semibold mb-4">Legal</h6>
          <ul className="space-y-2">
            <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/security" className="hover:underline">Security</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h6 className="uppercase font-semibold mb-4">Explore</h6>
          <ul className="space-y-2">
            <li><a href="/tenders" className="hover:underline">Browse Tenders</a></li>
            <li><a href="/suppliers" className="hover:underline">Supplier Directory</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GovBuy. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
