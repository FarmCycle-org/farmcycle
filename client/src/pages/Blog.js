import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Blog() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Our Blog</h1>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          Stay updated with the latest news, success stories, tips on waste management, and insights into sustainable living from the FarmCycle community.
        </p>
        <div className="mt-12 text-center text-gray-600">
          <p>More blog posts coming soon!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}