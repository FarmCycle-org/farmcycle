// src/components/ImpactSection.jsx

import React from "react";
import CountUp from "react-countup";
import { FaLeaf, FaRecycle, FaCloud, FaUsers, FaTruck, FaWater } from "react-icons/fa"; // Import FaWater icon

const ImpactSection = () => {
  return (
    <section id="impact" className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 text-left">
          Our Impact So Far
        </h2>
        <p className="text-green-800 mb-12 text-left">
          Every kilogram of waste recycled, composted, or reused helps reduce greenhouse gas emissions,
          conserve resources, and build a sustainable world. Here’s how FarmCycle is making a difference.
        </p>

        {/* Educational Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl text-center font-semibold text-green-800 mb-2">
              Food Waste
            </h3>
            <p className="text-green-700">
              1 kg of food waste emits up to 2.5 kg CO2 if landfilled.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl text-center font-semibold text-green-800 mb-2">
              Water Saved
            </h3>
            <p className="text-green-700">
              Composting 1 ton of organic waste can save thousands of liters of water.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl text-center font-semibold text-green-800 mb-2">
              Compost
            </h3>
            <p className="text-green-700">
              1 ton of composted waste returns 200 kg of nutrients to soil.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Waste Diverted */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <FaRecycle className="text-4xl text-green-600 mb-2" />
            <CountUp end={3500} duration={3} separator="," className="text-3xl font-bold text-green-900" />
            <p className="text-green-700 mt-1">kg Organic Waste Diverted</p> {/* Clarified "Organic Waste" */}
          </div>

          {/* CO2 Prevented */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <FaCloud className="text-4xl text-green-600 mb-2" />
            <CountUp end={8750} duration={3} separator="," className="text-3xl font-bold text-green-900" />
            <p className="text-green-700 mt-1">kg CO2 Emissions Prevented</p>
          </div>

          {/* Liters Water Saved */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <FaWater className="text-4xl text-green-600 mb-2" /> {/* Changed icon to FaWater */}
            <CountUp end={150000} duration={3} separator="," className="text-3xl font-bold text-green-900" /> {/* Adjusted count */}
            <p className="text-green-700 mt-1">Liters Water Saved</p> {/* Changed text */}
          </div>

          {/* Compost Generated */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <FaLeaf className="text-4xl text-green-600 mb-2" />
            <CountUp end={1400} duration={3} separator="," className="text-3xl font-bold text-green-900" />
            <p className="text-green-700 mt-1">kg Compost Generated</p>
          </div>

          {/* Pickups Completed */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <FaTruck className="text-4xl text-green-600 mb-2" />
            <CountUp end={320} duration={3} separator="," className="text-3xl font-bold text-green-900" />
            <p className="text-green-700 mt-1">Pickups Completed</p>
          </div>

          {/* Active Users */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <FaUsers className="text-4xl text-green-600 mb-2" />
            <CountUp end={150} duration={3} separator="," className="text-3xl font-bold text-green-900" />
            <p className="text-green-700 mt-1">Active Users</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;