// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom"; // Make sure Link is imported

export default function Navbar() {
  return (
    <nav className="mx-auto flex justify-between items-center py-4 px-6 bg-emerald-600 w-full">
      <div className="flex items-center space-x-8">
        {/* Link for the site title/logo to go to the home page */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-white">FarmCycle</Link>

        <div className="hidden md:flex space-x-4">
          {/* Change <a> to <Link> and use `to` prop with path + hash */}
          <Link to="/#home" className="text-white hover:text-gray-800">Home</Link>
          <Link to="/#how-it-works" className="text-white hover:text-gray-800">How It Works</Link>
          <Link to="/#why-choose" className="text-white hover:text-gray-800">Benefits</Link>
          <Link to="/#impact" className="text-white hover:text-gray-800">Impact</Link>
          <Link to="/#testimonials" className="text-white hover:text-gray-800">Reviews</Link>
        </div>
      </div>
      <div className="space-x-4">
        <Link to="/login" className="text-white hover:text-gray-800">Login</Link>
        <Link to="/register" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">Get Started</Link>
      </div>
    </nav>
  );
}
//original
// import React from "react";
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="mx-auto flex justify-between items-center py-4 px-6 bg-emerald-600 w-full">
//       <div className="flex items-center space-x-8">
//         <h1 className="text-2xl font-bold text-gray-800">FarmCycle</h1>
//         <div className="hidden md:flex space-x-4">
//           <a href="#home" className="text-white hover:text-gray-800">Home</a>
//           <a href="#how-it-works" className="text-white hover:text-gray-800">How It Works</a>
//           <a href="#why-choose" className="text-white hover:text-gray-800">Benefits</a>
//           <a href="#impact" className="text-white hover:text-gray-800">Impact</a>
//           <a href="#testimonials" className="text-white hover:text-gray-800">Reviews</a>
//         </div>
//       </div>
//       <div className="space-x-4">
//         <Link to="/login" className="text-white hover:text-gray-800">Login</Link>
//         <Link to="/register" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">Get Started</Link>
//       </div>
//     </nav>
//   );
// }
