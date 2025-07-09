import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Terms & Conditions</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-gray-700 leading-relaxed max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using the FarmCycle platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our service.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">2. Description of Service</h2>
          <p className="mb-4">
            FarmCycle provides an online platform that connects individuals and organizations (Providers) who generate organic waste with individuals and businesses (Collectors) who can repurpose or recycle these materials.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">3. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Users must provide accurate and complete information during registration and when listing or claiming waste.</li>
            <li>Providers are responsible for the accurate description and quality of the organic waste listed.</li>
            <li>Collectors are responsible for the safe and timely pickup of claimed waste and its proper processing.</li>
            <li>All users must adhere to local waste management regulations and environmental laws.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">4. Prohibited Activities</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Listing or collecting non-organic or hazardous waste.</li>
            <li>Engaging in fraudulent or deceptive practices.</li>
            <li>Harassing or misrepresenting other users.</li>
            <li>Using the platform for any illegal or unauthorized purpose.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">5. Disclaimers and Limitation of Liability</h2>
          <p className="mb-4">
            FarmCycle acts as a facilitator and does not directly participate in the collection or processing of waste. We are not responsible for the quality or quantity of waste exchanged, nor for any issues arising during pickup or processing.
          </p>
          <p className="mb-4">
            FarmCycle will not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">6. Changes to Terms</h2>
          <p className="mb-4">
            FarmCycle reserves the right to modify these Terms and Conditions at any time. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-2xl font-semibold text-green-700 mb-4 mt-8">7. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at support@farmcycle.app.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}