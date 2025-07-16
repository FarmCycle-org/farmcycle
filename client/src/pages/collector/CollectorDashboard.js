import React, { useEffect, useState } from "react";
import API from "../../services/api";
import CollectorNavbar from "../../components/CollectorNavbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FaCloud, FaBox, FaCheckCircle } from 'react-icons/fa'; // Import Font Awesome icons

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#F44336", "#607D8B"];

const impactFactors = {
  "Food Scraps": { co2: 0.25 },
  "Yard/Garden Waste": { co2: 0.25 },
  "Agricultural Waste": { co2: 0.25 },
  "Compostable Paper/Cardboard": { trees: 0.017 },
  "Other Organic Material": { co2: 0.25 },
};

const CollectorDashboard = () => {
  const [claimedItems, setClaimedItems] = useState([]);
  const [stats, setStats] = useState({});
  const [userHasLocation, setUserHasLocation] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/claims/my/claims", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter(claim => claim.waste);
        setClaimedItems(filtered);
        calculateStats(filtered);
      } catch (err) {
        console.error("Error fetching claims:", err);
      }
    };

    fetchClaims();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const coords = res.data?.location?.coordinates;
        setUserHasLocation(Array.isArray(coords) && coords.length === 2);
      } catch (err) {
        console.error("Failed to check user location:", err);
      }
    };

    fetchUser();
  }, []);

  const calculateStats = (claims) => {
    const accepted = claims.filter((claim) => claim.status === "accepted");
    const collected = claims.filter((claim) => claim.waste?.status === "collected");

    let total = 0;
    let co2Saved = 0;
    const byType = {};

    collected.forEach((claim) => {
      const qty = parseFloat(claim.waste?.quantity) || 0;
      total += qty;

      const type = claim.waste?.wasteType;
      if (type) {
        byType[type] = (byType[type] || 0) + qty;
        const factor = impactFactors[type];
        if (factor?.co2) co2Saved += factor.co2 * qty;
      }
    });

    setStats({
      totalWaste: total.toFixed(1),
      totalClaims: claims.length,
      acceptedClaims: accepted.length,
      collectedWasteCount: collected.length,
      co2Saved: co2Saved.toFixed(2),
      chartData: Object.entries(byType).map(([type, quantity]) => ({ type, quantity })),
    });
  };

  return (
    <>
      <CollectorNavbar />
      <div className="min-h-screen bg-gray-100 py-8"> {/* Consistent background */}
        {!userHasLocation && (
          <div className="bg-yellow-100 text-yellow-800 text-sm text-center py-2 px-4 rounded-lg shadow-md mx-auto max-w-7xl mb-6"> {/* Styled warning */}
            ⚠️ You haven't added your location.{" "}
            <a href="/collector/profile" className="underline text-blue-600 hover:text-blue-800 font-medium">
              Click here to set
            </a>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-green-800 mb-12 text-center tracking-tight"> {/* Consistent heading style */}
            Collector Dashboard
          </h1>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Total Waste Collected" value={`${stats.totalWaste || 0} kg`} />
            <StatCard label="Total Claims Made" value={stats.totalClaims || 0} />
            <StatCard label="Claims Accepted" value={`${stats.acceptedClaims || 0}`} />
            <StatCard label="Wastes Collected" value={stats.collectedWasteCount || 0} />
          </div>

          {/* Charts and Impact section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"> {/* Adjusted to lg:grid-cols-2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"> {/* Consistent card styling */}
              <h2 className="text-2xl font-bold text-green-700 mb-6">Waste Distribution by Type</h2> {/* Bolder heading */}
              {stats.chartData && stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.chartData}
                      dataKey="quantity"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {stats.chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-10 text-lg">No data to display for waste distribution.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"> {/* Consistent card styling */}
              <h2 className="text-2xl font-bold text-green-700 mb-6">Impact Summary</h2> {/* Bolder heading */}
              <ul className="space-y-4 text-lg"> {/* Larger text for impact list */}
                <li className="text-gray-700 flex items-center">
                  <FaCloud className="text-2xl mr-3 text-blue-500" /> CO₂ Prevented: <strong className="ml-2 text-green-800">{stats.co2Saved} kg</strong>
                </li>
                <li className="text-gray-700 flex items-center">
                  <FaBox className="text-2xl mr-3 text-orange-500" /> Total Waste Collected: <strong className="ml-2 text-green-800">{stats.totalWaste} kg</strong>
                </li>
                <li className="text-gray-700 flex items-center">
                  <FaBox className="text-2xl mr-3 text-purple-500" /> Total Claims Made: <strong className="ml-2 text-green-800">{stats.totalClaims}</strong>
                </li>
                <li className="text-gray-700 flex items-center">
                  <FaCheckCircle className="text-2xl mr-3 text-green-600" /> Claims Accepted: <strong className="ml-2 text-green-800">{stats.acceptedClaims}</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Bar Chart Full Width */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10"> {/* Consistent card styling */}
            <h2 className="text-2xl font-bold text-green-700 mb-6">Waste Breakdown by Type (Collected)</h2> {/* Bolder heading */}
            {stats.chartData && stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.chartData || []}>
                  <XAxis dataKey="type" stroke="#6B7280" /> {/* Darker axis labels */}
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#4CAF50"> {/* Default bar color */}
                    {stats.chartData?.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10 text-lg">No data to display for waste breakdown.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl text-center flex flex-col justify-center items-center h-full"> {/* Enhanced card styling, added flex for centering */}
    <p className="text-lg text-gray-500 mb-2">{label}</p> {/* Slightly larger label */}
    <h2 className="text-5xl font-extrabold text-green-800 leading-tight">{value}</h2> {/* Much larger, bolder value */}
  </div>
);

export default CollectorDashboard;