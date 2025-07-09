import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function Footer() {
  return (
    <footer className="bg-emerald-600 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">About FarmCycle</h4>
          <p className="text-sm">
            FarmCycle connects waste providers and collectors to promote a zero-waste ecosystem. We make it easy to recycle, compost, and create a sustainable impact.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/#home" className="hover:underline">Home</Link></li>
            <li><Link to="/#how-it-works" className="hover:underline">How It Works</Link></li>
            <li><Link to="/#why-choose" className="hover:underline">Why Choose Us</Link></li>
            <li><Link to="/#testimonials" className="hover:underline">Reviews</Link></li> 
            <li><Link to="/register" className="hover:underline">Get Started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
            <li><Link to="/help-center" className="hover:underline">Help Center</Link></li>
            <li><Link to="/terms-conditions" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="text-sm mb-2">support@farmcycle.app</p>
          <p className="text-sm mb-2">+91 98765 43210</p>
          <p className="text-sm">Thapar University, Patiala, India</p>
          <div className="flex space-x-4 mt-4">

            <span className="w-8 h-8 bg-white text-green-700 rounded-full flex items-center justify-center">
              <i className="fab fa-facebook-f"></i>
            </span>
            <span className="w-8 h-8 bg-white text-green-700 rounded-full flex items-center justify-center">
              <i className="fab fa-twitter"></i>
            </span>
            <span className="w-8 h-8 bg-white text-green-700 rounded-full flex items-center justify-center">
              <i className="fab fa-instagram"></i>
            </span>
            <span className="w-8 h-8 bg-white text-green-700 rounded-full flex items-center justify-center">
              <i className="fab fa-linkedin-in"></i>
            </span>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-8 border-t border-green-600 pt-4">
        © {new Date().getFullYear()} FarmCycle. Made by Amol and Gurnoor.
      </div>
    </footer>
  );
}
