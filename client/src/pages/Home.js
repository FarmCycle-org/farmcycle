import React, {useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import FarmCycleIllustration from '../assets/hero-img.png'; 
import FarmCycleIllustration2 from '../assets/how-it-works.png'; 
import ImpactSection from "./Impact";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the component has rendered and elements are in DOM
      const timer = setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1)); // Remove '#'
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); 
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [location]); // Re-run effect when location changes (specifically hash)

  return (
    <div className="bg-[white] text-gray-800">

      {/* NAVBAR */}
       <Navbar/>

      {/* Hero */}
      <section id="home" className="container mx-auto flex flex-col md:flex-row items-center py-16 px-6">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Transform Waste Into Opportunity
          </h2>
          <p className="text-lg text-gray-600">
            FarmCycle connects waste generators and collectors to build a zero-waste, sustainable community.
          </p>
          <Link
            to="/register"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700 font-medium"
          >
            Join the Movement
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src={FarmCycleIllustration}
            alt="FarmCycle Illustration"
            className="rounded-lg"
          />
        </div>
      </section>


     {/* FEATURES/ WHY CHOOSE US */}
<section id="why-choose" className="py-16 bg-white">
  {/* The outer div for the whole section content */}
  {/* REMOVED 'container' class from here. */}
  {/* Set a consistent max-width for the entire content block, and ensure padding. */}
  <div className="mx-auto px-6 max-w-7xl"> {/* Using max-w-7xl here for the entire content block */}

    {/* Heading for the section */}
    <h2 className="text-3xl md:text-4xl font-bold text-left mb-4"> {/* Ensured text-left here */}
      Why Choose FarmCycle
    </h2>

    {/* Introductory Paragraph */}
    {/* Removed 'max-w-6xl' and 'mx-auto' from the paragraph itself. */}
    {/* It will now take the full width of its parent 'max-w-7xl' div, aligning left. */}
    {/* Removed <br> as it's not standard for spacing in modern CSS. Use margin utility classes. */}
    <p className="text-left text-gray-600 mb-12 text-lg md:text-xl leading-relaxed"> {/* Ensured text-left here */}
      FarmCycle connects waste providers and collectors to build a circular, sustainable economy. Whether you want to dispose responsibly or collect resources efficiently, FarmCycle gives you the tools to do it smarter.
    </p>

    {/* Provider Section */}
    <h3 className="text-2xl font-semibold text-left mb-6 text-emerald-600">Got Organic Surplus or Waste? Here's how FarmCycle helps you make an impact</h3>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
      {[
        { title: "Dispose Responsibly", desc: "Easily share your surplus or waste with verified collectors and ensure proper disposal." },
        { title: "Reduce Costs", desc: "Lower your waste management expenses by connecting with local recyclers and composters." },
        { title: "Support Sustainability", desc: "Help nearby communities and small businesses thrive with your contributions." },
        { title: "Earn Badges", desc: "Showcase your eco-friendly practices with FarmCycle sustainability badges." },
      ].map((card, idx) => (
        <div
          key={idx}
          // Using min-h-[320px] as you have it, which is good for fixed height.
          // Ensure text is aligned left within cards for consistency with section.
          // Changed text-center to text-left
          className="bg-gray-50 border border-gray-200 p-6 py-8 rounded-2xl min-h-[320px] flex flex-col justify-start text-center shadow hover:shadow-lg transition duration-300 hover:bg-[#60e4a4]/40"
        >
          <h4 className="font-bold text-lg mb-2">{card.title}</h4>
          <p className="text-gray-600">{card.desc}</p>
        </div>
      ))}
    </div>

    {/* Collector Section */}
    <h3 className="text-2xl font-semibold text-left mb-6 text-emerald-600">Looking for Resources? FarmCycle helps you collect efficiently</h3>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        { title: "Source Materials Easily", desc: "Find nearby waste listings tailored to your needs, from organic scraps to recyclables." },
        { title: "Smart Scheduling", desc: "Coordinate pickups seamlessly with integrated scheduling and notifications." },
        { title: "Build Trust", desc: "Develop lasting relationships with reliable providers in your area." },
        { title: "Track Impact", desc: "Measure and showcase the environmental impact of your collections." },
      ].map((card, idx) => (
        <div
          key={idx}
          className="bg-gray-50 border border-gray-200 p-6 py-8 rounded-2xl min-h-[320px] flex flex-col justify-start text-center shadow hover:shadow-lg transition duration-300 hover:bg-[#60e4a4]/40"
        >
          <h4 className="font-bold text-lg mb-2">{card.title}</h4>
          <p className="text-gray-600">{card.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      
      <div>
        <h2 className="text-4xl font-bold mb-4 text-left">
          How FarmCycle Works
        </h2>
        <p className="text-gray-600 text-left mb-6 max-w-2xl">
          FarmCycle is designed to connect <i>individuals and organizations</i> that generate waste, be it households, hotels, restaurants, cafes, and factories—with collectors who can repurpose or recycle these materials. 
          <br /><br />
          Whether you're a solo waste provider or managing an organization, you can register your profile, list your waste items with details like type, quantity, and location, and easily schedule pickups with verified collectors. 
          <br /><br />
          Collectors can browse available listings, claim pickups, and contribute to a sustainable ecosystem while reducing landfill burden and promoting circular economy practices.
        </p>
      </div>
      {/* Right Side - Image */}
      <div className="flex justify-center items-center">
        <img
          src={FarmCycleIllustration2}
          alt="How it works illustration"
          className="w-4/5 rounded"
        />
      </div>
    </div>
    
    {/* Steps */}
    <h6 className="text-3xl font-semibold mb-4 text-left">
          Get Started in 3 easy steps
        </h6>
    <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
      {/* Step 1 */}
      <div className="bg-[#d8f4e4] p-6 pt-10 pb-10 rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold mb-2">1</h3>
        <h3 className="text-xl font-semibold mb-2">Sign Up & Create Profile</h3>
        <p className="text-gray-600">
          Register as an individual or an organization, set your location, and tell us about the types of waste you generate or collect.
        </p>
      </div>
      {/* Step 2 */}
      <div className="bg-[#d8f4e4] p-6 pt-10 pb-10 rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold mb-2">2</h3>
        <h3 className="text-xl font-semibold mb-2">List or Browse Waste Items</h3>
        <p className="text-gray-600">
          Providers can post waste listings with photos and details. Collectors can explore available items nearby.
        </p>
      </div>
      {/* Step 3 */}
      <div className="bg-[#d8f4e4] p-6 pt-10 pb-10 rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold mb-2">3</h3>
        <h3 className="text-xl font-semibold mb-2">Schedule Pickup & Close the Loop</h3>
        <p className="text-gray-600">
          Agree on a pickup time, mark the waste as collected, and optionally rate your experience to build trust in the community.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold mb-8 text-center">
      What Our Users Say
    </h2>

    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center min-h-[320px]">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User 1"
            className="w-20 h-20 rounded-full mb-4"
          />
          <p className="text-gray-600 italic mb-4 text-center">
            “FarmCycle made it so easy to give away my kitchen scraps to local farmers. Love this initiative!”
          </p>
          <p className="font-semibold mb-2">Priya Sharma</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.177 3.626a1 1 0 00.95.69h3.805c.969 0 1.371 1.24.588 1.81l-3.08 2.236a1 1 0 00-.364 1.118l1.176 3.626c.3.921-.755 1.688-1.54 1.118l-3.08-2.236a1 1 0 00-1.175 0l-3.08 2.236c-.785.57-1.84-.197-1.54-1.118l1.176-3.626a1 1 0 00-.364-1.118L2.43 9.053c-.783-.57-.38-1.81.588-1.81h3.805a1 1 0 00.95-.69l1.176-3.626z"/>
              </svg>
            ))}
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center min-h-[320px]">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User 2"
            className="w-20 h-20 rounded-full mb-4"
          />
          <p className="text-gray-600 italic mb-4 text-center">
            “As a restaurant owner, this platform helped us reduce waste and connect with NGOs effortlessly.”
          </p>
          <p className="font-semibold mb-2">Raj Patel</p>
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.177 3.626a1 1 0 00.95.69h3.805c.969 0 1.371 1.24.588 1.81l-3.08 2.236a1 1 0 00-.364 1.118l1.176 3.626c.3.921-.755 1.688-1.54 1.118l-3.08-2.236a1 1 0 00-1.175 0l-3.08 2.236c-.785.57-1.84-.197-1.54-1.118l1.176-3.626a1 1 0 00-.364-1.118L2.43 9.053c-.783-.57-.38-1.81.588-1.81h3.805a1 1 0 00.95-.69l1.176-3.626z"/>
              </svg>
            ))}
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center min-h-[320px]">
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt="User 3"
            className="w-20 h-20 rounded-full mb-4"
          />
          <p className="text-gray-600 italic mb-4 text-center">
            “Collecting waste for composting has never been simpler. FarmCycle is a game-changer.”
          </p>
          <p className="font-semibold mb-2">Aisha Khan</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.177 3.626a1 1 0 00.95.69h3.805c.969 0 1.371 1.24.588 1.81l-3.08 2.236a1 1 0 00-.364 1.118l1.176 3.626c.3.921-.755 1.688-1.54 1.118l-3.08-2.236a1 1 0 00-1.175 0l-3.08 2.236c-.785.57-1.84-.197-1.54-1.118l1.176-3.626a1 1 0 00-.364-1.118L2.43 9.053c-.783-.57-.38-1.81.588-1.81h3.805a1 1 0 00.95-.69l1.176-3.626z"/>
              </svg>
            ))}
          </div>
        </div>
      </SwiperSlide>
      {/* Slide 4 */}
            <SwiperSlide>
  <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-[400px] mx-auto h-80 flex flex-col justify-between">
    <div className="flex flex-col items-center">
      <img
        src="https://randomuser.me/api/portraits/women/72.jpg"
        alt="User 4"
        className="w-16 h-16 rounded-full mb-4 object-cover"
      />
      <p className="text-gray-700 italic">
        "A brilliant idea! As a restaurant owner, I always struggled with managing food waste. FarmCycle makes it effortless and meaningful."
      </p>
    </div>
    <div className="mt-4">
      <p className="font-semibold">Pooja Nair</p>
      <div className="flex justify-center mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
          </svg>
        ))}
      </div>
    </div>
  </div>
</SwiperSlide>
    </Swiper>
  </div>
</section>

{/* IMPACT */}
<ImpactSection />

      {/* CALL TO ACTION */}
      <section className="container mx-auto text-center py-16 px-6 bg-green-50">
        <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
        <p className="text-gray-600 mb-6">
          Join FarmCycle today and help create a sustainable future.
        </p>
        <Link
          to="/register"
          className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700 font-medium"
        >
          Get Started
        </Link>
      </section>

      {/* FOOTER */}
      <Footer/>
      
    </div>
  );
}
