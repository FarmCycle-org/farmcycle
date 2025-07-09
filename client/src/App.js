import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";

import HomePage from "./pages/Home.js";
import 'leaflet/dist/leaflet.css';

// Auth pages
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";

// Provider pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import MyListings from "./pages/provider/MyListings";
import Requests from "./pages/provider/Requests";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderHistory from "./pages/provider/ProviderHistory.js";
import ProviderNotifications from "./pages/provider/ProviderNotifications.js";

// Collector pages
import CollectorDashboard from "./pages/collector/CollectorDashboard";
import Browse from "./pages/collector/Browse";
import MyRequests from "./pages/collector/MyRequests";
import CollectorProfile from "./pages/collector/CollectorProfile";
import CollectorHistory from "./pages/collector/CollectorHistory";
import CollectorNotifications from "./pages/collector/CollectorNotifications.js";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.js";

import FAQs from "./pages/FAQs.js";
import Blog from "./pages/Blog.js";
import HelpCenter from "./pages/HelpCenter.js";
import TermsAndConditions from "./pages/TermsAndConditions.js";
import PrivacyPolicy from "./pages/PrivacyPolicy.js";


function App() {

  const { loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>; // Optional fallback
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/faqs" element={<FAQs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Provider Protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/my-listings" element={<MyListings />} />
          <Route path="/provider/requests" element={<Requests />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path="/provider/history" element={<ProviderHistory />} />
          <Route path="/provider/notifications" element={<ProviderNotifications />} />
        </Route>

        {/* Collector-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["collector"]} />}>
          <Route path="/collector/dashboard" element={<CollectorDashboard />} />
          <Route path="/collector/browse" element={<Browse />} />
          <Route path="/collector/my-requests" element={<MyRequests />} />
          <Route path="/collector/profile" element={<CollectorProfile />} />
          <Route path="/collector/history" element={<CollectorHistory />} />
          <Route path="/collector/notifications" element={<CollectorNotifications />} />
        </Route>

         {/* Optional: fallback 404 or redirect */}
          {/* <Route path="*" element={<NotFound />} /> */}
          

      </Routes>
    </Router>
  );
}

export default App;
