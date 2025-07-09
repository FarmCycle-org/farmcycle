import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-gray-700 leading-relaxed max-w-4xl mx-auto">
          <p className="mb-4">
            This Privacy Policy describes how FarmCycle ("we," "us," or "our") collects, uses, and discloses your personal information when you use our website and services.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you create an account, list waste, claim waste, or communicate with us. This may include:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Personal Identifiers: Name, email address, phone number, address.</li>
            <li>Account Information: Username, password.</li>
            <li>Waste Details: Type, quantity, and location of waste you list or claim.</li>
            <li>Communication Data: Records of your correspondence with us.</li>
          </ul>
          <p className="mb-4">
            We also collect certain information automatically when you access and use our service, such as IP addresses, browser type, operating system, referring URLs, and interaction with the site.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Provide, maintain, and improve our services.</li>
            <li>Facilitate connections between waste Providers and Collectors.</li>
            <li>Process transactions and send related notifications.</li>
            <li>Respond to your inquiries and provide customer support.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
            <li>Detect, prevent, and address technical issues or fraudulent activities.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">3. Sharing Your Information</h2>
          <p className="mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Other Users: When you list or claim waste, relevant details (e.g., location, contact method, waste type) will be shared with the other party to facilitate the exchange.</li>
            <li>Service Providers: Third-party vendors who perform services on our behalf (e.g., hosting, analytics, payment processing).</li>
            <li>Legal Compliance: When required by law or to protect our rights, property, or safety, or that of others.</li>
            <li>Business Transfers: In connection with a merger, sale of assets, or other business transaction.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">4. Data Security</h2>
          <p className="mb-4">
            We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">5. Your Choices and Rights</h2>
          <p className="mb-4">
            You may have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us to exercise these rights.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">6. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@farmcycle.app.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}