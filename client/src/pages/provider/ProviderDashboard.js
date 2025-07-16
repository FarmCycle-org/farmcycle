import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import ProviderNavbar from "../../components/ProviderNavbar";
import { FaCloud, FaLeaf, FaBox } from 'react-icons/fa'; // Import Font Awesome icons

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#F44336", "#607D8B"];

const impactFactors = {
  "Food Scraps": { co2: 0.25 }, 
  "Yard/Garden Waste": { co2: 0.25 }, 
  "Agricultural Waste": { co2: 0.25 }, 
  "Compostable Paper/Cardboard": { trees: 0.017 }, 
  "Other Organic Material": { co2: 0.25 }, 
};

const ProviderDashboard = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [stats, setStats] = useState({});
  const [userHasLocation, setUserHasLocation] = useState(true);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/waste/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWasteItems(res.data);
        calculateStats(res.data);
      } catch (err) {
        console.error("Error fetching waste data:", err);
      }
    };

    fetchWasteData();
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

  const calculateStats = (items) => {
    const byType = {};
    let totalCollectedQty = 0;
    let collectedCount = 0;
    let activeCount = 0;
    let co2Saved = 0;
    let treesSaved = 0;

    items.forEach((item) => {
      const qty = parseFloat(item.quantity) || 0;
      if (item.status === "collected") {
        collectedCount += 1;
        totalCollectedQty += qty;

        const type = item.wasteType;
        byType[type] = (byType[type] || 0) + qty;

        const factor = impactFactors[type];
        if (factor?.co2) co2Saved += factor.co2 * qty;
        if (factor?.trees) treesSaved += factor.trees * qty;
      } else {
        activeCount += 1;
      }
    });

    setStats({
      totalCollectedQty: totalCollectedQty.toFixed(2),
      activeListings: activeCount,
      collectedListings: collectedCount,
      co2Saved: co2Saved.toFixed(2),
      treesSaved: treesSaved.toFixed(2),
      chartData: Object.entries(byType).map(([type, quantity]) => ({ type, quantity })),
    });
  };

  return (
    <>
      <ProviderNavbar />
      <div className="min-h-screen bg-gray-100 py-8"> 
        {!userHasLocation && (
          <div className="bg-yellow-100 text-yellow-800 text-sm text-center py-2 px-4 rounded-lg shadow-md mx-auto max-w-7xl mb-6"> {/* Styled warning */}
            ⚠️ You haven't added your location.{" "}
            <a href="/provider/profile" className="underline text-blue-600 hover:text-blue-800 font-medium">
              Click here to set
            </a>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-green-800 mb-12 text-center tracking-tight"> {/* Consistent heading style */}
            Provider Dashboard
          </h1>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard label="Total Waste Provided" value={`${stats.totalCollectedQty || 0} kg`} />
            <StatCard label="Active Listings" value={stats.activeListings || 0} />
            <StatCard label="Collected Listings" value={stats.collectedListings || 0} />
          </div>

          {/* Charts and Impact section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"> {/* Adjusted to lg:grid-cols-2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"> {/* Consistent card styling */}
              <h2 className="text-2xl font-bold text-green-700 mb-6">Collected Waste Distribution</h2> {/* Bolder heading */}
              {stats.chartData && stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.chartData || []}
                      dataKey="quantity"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {stats.chartData?.map((_, i) => (
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
              <h2 className="text-2xl font-bold text-green-700 mb-6">Environmental Impact</h2> {/* Bolder heading */}
              <ul className="space-y-4 text-lg"> {/* Larger text for impact list */}
                <li className="text-gray-700 flex items-center">
                  <FaCloud className="text-2xl mr-3 text-blue-500" /> CO₂ Prevented: <strong className="ml-2 text-green-800">{stats.co2Saved} kg</strong>
                </li>
                <li className="text-gray-700 flex items-center">
                  <FaLeaf className="text-2xl mr-3 text-green-600" /> Trees Saved: <strong className="ml-2 text-green-800">{stats.treesSaved}</strong>
                </li>
                <li className="text-gray-700 flex items-center">
                  <FaBox className="text-2xl mr-3 text-orange-500" /> Total Waste Provided: <strong className="ml-2 text-green-800">{stats.totalCollectedQty} kg</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Bar Chart Full Width */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10"> {/* Consistent card styling */}
            <h2 className="text-2xl font-bold text-green-700 mb-6">Collected Waste Breakdown by Type</h2> {/* Bolder heading */}
            {stats.chartData && stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.chartData || []}>
                  <XAxis dataKey="type" stroke="#6B7280" /> {/* Darker axis labels */}
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#4CAF50"> {/* Default bar color */}
                    {(stats.chartData || []).map((_, index) => (
                      <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default ProviderDashboard;
