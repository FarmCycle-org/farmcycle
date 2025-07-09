import React, { useState } from "react"; // Import useState for accordion functionality
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqIllustration from '../assets/faq-illustration.png'; // Assuming you put your FAQ illustration here
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'; // Icons for accordion toggle

const FAQs = () => {
  // State to manage which FAQ item is open
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is FarmCycle and how does it work?",
      answer: (
        <>
          FarmCycle is an innovative digital platform dedicated to diverting organic waste from landfills. We create a seamless connection between those who generate organic waste ("Providers") and those who can give it a new purpose ("Collectors"). Our core mission is to foster a sustainable, circular economy by reducing environmental pollution, enriching soil, generating renewable energy, and minimizing carbon footprints.
          <br /><br />
          Providers can easily list their organic waste with details, and Collectors can browse available listings to claim materials for composting, biogas production, animal feed, or other beneficial uses.
        </>
      ),
    },
    {
      question: "Who can participate in FarmCycle?",
      answer: (
        <>
          FarmCycle is built for a diverse community committed to sustainability, including both waste generators (Providers) and waste processors (Collectors).
          <br /><br />
          <h4 className="font-semibold text-lg text-green-700 mt-4 mb-2">For Providers (Waste Generators):</h4>
          If you generate organic waste and want to dispose of it responsibly and efficiently, you're a potential Provider! This includes:
          <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
            <li>Restaurants & Hotels: Food scraps, kitchen prep waste, spoiled produce.</li>
            <li>Catering Services: Post-event organic food waste.</li>
            <li>Schools & Universities: Cafeteria waste, organic garden trimmings.</li>
            <li>Corporate Offices: Organic waste from office canteens and breakrooms.</li>
            <li>Grocery Stores & Markets: Unsold fruits, vegetables, and other organic perishables.</li>
            <li>Food Processing Factories: Organic by-products and trimmings.</li>
            <li>Households: Daily kitchen scraps, garden waste.</li>
            <li>Farms: Crop residues, spoiled produce, certain types of animal manure.</li>
          </ul>
          <h4 className="font-semibold text-lg text-green-700 mt-6 mb-2">For Collectors (Waste Processors):</h4>
          If you're looking for a sustainable source of organic material for your operations, you're a potential Collector! This includes:
          <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
            <li>Composting Units: Individuals, community gardens, or commercial facilities turning organic waste into nutrient-rich compost.</li>
            <li>Biogas Plants: Facilities converting organic matter into renewable energy (biogas).</li>
            <li>Farms: Utilizing organic waste for on-site composting, soil amendment, or appropriate animal feed.</li>
            <li>Environmental NGOs & Community Initiatives: Groups dedicated to local composting projects and waste reduction efforts.</li>
            <li>Specialized Recycling Centers: Those with dedicated organic waste processing capabilities.</li>
          </ul>
        </>
      ),
    },
    {
      question: "What types of waste does FarmCycle accept?",
      answer: (
        <>
          FarmCycle focuses exclusively on organic, biodegradable waste. Our goal is to ensure the collected materials are suitable for composting, anaerobic digestion, or other organic recycling processes without contamination.
          <br /><br />
          <h4 className="font-semibold text-lg text-green-700 mt-4 mb-2">We Gladly Accept:</h4>
          <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
            <li>Food Scraps:
              <ul className="list-circle list-inside ml-6 space-y-1">
                <li>Fruits and vegetables (peels, cores, scraps, spoiled produce)</li>
                <li>Cooked food (rice, pasta, bread, grains - ideally without excessive oil or meat for easier composting)</li>
                <li>Coffee grounds and filters</li>
                <li>Tea bags (paper or biodegradable mesh)</li>
                <li>Eggshells</li>
              </ul>
            </li>
            <li>Yard & Garden Waste:
              <ul className="list-circle list-inside ml-6 space-y-1">
                <li>Leaves</li>
                <li>Grass clippings</li>
                <li>Small twigs and non-woody plant trimmings</li>
                <li>Flowers and plants (without pots or ties)</li>
              </ul>
            </li>
            <li>Other Biodegradables:
              <ul className="list-circle list-inside ml-6 space-y-1">
                <li>Paper towels and napkins (unsoiled/lightly soiled, compostable)</li>
                <li>Plain cardboard (torn into small pieces, unwaxed)</li>
                <li>Sawdust (untreated wood)</li>
                <li>Animal manure (from herbivores, with specific collection guidelines)</li>
              </ul>
            </li>
          </ul>
          <h4 className="font-semibold text-lg text-red-600 mt-6 mb-2">We DO NOT Accept (Contaminants):</h4>
          To maintain the quality of the compost and biogas, and to protect the environment, please DO NOT include:
          <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
            <li>Plastics: All types of plastic (bottles, bags, containers, wrappers, cutlery)</li>
            <li>Metals: Cans, aluminum foil, batteries, electronics</li>
            <li>Glass: Bottles, jars, broken glass</li>
            <li>Styrofoam: Cups, containers, packing materials</li>
            <li>Diapers & Sanitary Products: Including "biodegradable" versions (due to hygiene and processing difficulties)</li>
            <li>Hazardous Waste: Chemicals, paints, solvents, motor oil</li>
            <li>Medical Waste: Syringes, bandages, medications</li>
            <li>Excessive Oils & Greases: Large quantities of cooking oil (small amounts on food scraps are usually okay)</li>
            <li>Non-biodegradable materials of any kind.</li>
          </ul>
        </>
      ),
    },
    // You can add more FAQ items here
    {
        question: "How do I sign up and create a profile?",
        answer: (
            <>
                To get started, simply navigate to the "Register" page. You can sign up as an individual or an organization. During registration, you'll set your location and specify the types of waste you generate (if you're a Provider) or collect (if you're a Collector).
            </>
        )
    },
    {
        question: "How do I list or browse waste items?",
        answer: (
            <>
                If you are a Provider, once your profile is set up, you can easily post new waste listings. Be sure to include details like the type, quantity, and location of the waste, and optionally upload photos.
                <br /><br />
                If you are a Collector, you can browse through available waste listings in your area. Our platform allows you to filter listings to find the specific types and quantities of organic materials you need.
            </>
        )
    },
    {
        question: "How do I schedule a pickup and close the loop?",
        answer: (
            <>
                Once a Provider lists waste and a Collector expresses interest, you can communicate through the platform to agree on a convenient pickup time. After the waste has been successfully collected, both parties can mark the transaction as complete. Optionally, you can rate your experience with the other party, which helps build trust and reliability within the FarmCycle community.
            </>
        )
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section with Illustration */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-green-800 mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <div className="flex justify-center items-center mb-8">
              <img
                src={FaqIllustration} // Your FAQ illustration
                alt="FAQs illustration"
                className="w-4/5 md:w-3/5 lg:w-2/5 max-w-lg rounded" // Responsive image sizing
              />
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Find answers to common questions about how FarmCycle works, who can participate, and what types of waste we handle.
            </p>
          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0 py-4">
                <button
                  className="flex justify-between items-center w-full text-left font-bold text-xl text-gray-800 hover:text-green-700 transition duration-200 ease-in-out"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  {item.question}
                  {openIndex === index ? (
                    <FaMinusCircle className="text-green-600 ml-4" />
                  ) : (
                    <FaPlusCircle className="text-green-600 ml-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div id={`faq-answer-${index}`} className="mt-4 text-lg text-gray-700 leading-relaxed pr-8 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQs;