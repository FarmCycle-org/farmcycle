import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";

// Auth pages
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";

// Provider pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import MyListings from "./pages/provider/MyListings";
import Requests from "./pages/provider/Requests";
import ProviderProfile from "./pages/provider/ProviderProfile";

// Collector pages
import CollectorDashboard from "./pages/collector/CollectorDashboard";
import Browse from "./pages/collector/Browse";
import MyRequests from "./pages/collector/MyRequests";
import CollectorProfile from "./pages/collector/CollectorProfile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.js";

function App() {

  const { loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>; // Optional fallback
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Provider Protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/my-listings" element={<MyListings />} />
          <Route path="/provider/requests" element={<Requests />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
        </Route>

        {/* Collector-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["collector"]} />}>
          <Route path="/collector/dashboard" element={<CollectorDashboard />} />
          <Route path="/collector/browse" element={<Browse />} />
          <Route path="/collector/my-requests" element={<MyRequests />} />
          <Route path="/collector/profile" element={<CollectorProfile />} />
        </Route>

         {/* Optional: fallback 404 or redirect */}
          {/* <Route path="*" element={<NotFound />} /> */}
          
        {/* Add more routes here */}

      </Routes>
    </Router>
  );
}

export default App;
