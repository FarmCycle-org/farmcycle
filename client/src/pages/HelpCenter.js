import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function HelpCenter() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Help Center</h1>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          Need assistance? Find answers to your questions, troubleshooting tips, and contact options for support.
        </p>
        <div className="mt-12 p-8 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">How Can We Help?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Browse our <Link to="/faqs" className="text-blue-600 hover:underline">FAQs</Link> for common questions.</li>
            <li>Learn more about <Link to="/#how-it-works" className="text-blue-600 hover:underline">How FarmCycle Works</Link>.</li>
            <li>For account or technical issues, please contact our support team.</li>
            <li>Submit a ticket for specific inquiries.</li>
          </ul>
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-800 mb-2">Can't find what you're looking for?</p>
            <p className="text-green-700 font-semibold">Email us at: support@farmcycle.app</p>
            <p className="text-green-700 font-semibold">Call us at: +91 98765 43210</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}