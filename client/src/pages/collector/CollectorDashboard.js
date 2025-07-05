import React, { useEffect, useState } from "react";
import axios from "axios";
import CollectorNavbar from "../../components/CollectorNavbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#F44336", "#607D8B"];

const impactFactors = {
  plastic: { co2: 1.5 },
  paper: { trees: 0.017 },
  metal: { co2: 3 },
  organic: { co2: 0.25 },
};

const CollectorDashboard = () => {
  const [claimedItems, setClaimedItems] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/claims/my/claims", {
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold text-green-700 mb-14 text-center">Collector Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Waste Collected" value={`${stats.totalWaste || 0} kg`} />
          <StatCard label="Total Claims Made" value={stats.totalClaims || 0} />
          <StatCard label="Claims Accepted" value={`${stats.acceptedClaims || 0}`} />
          <StatCard label="Wastes Collected" value={stats.collectedWasteCount || 0} />
        </div>

        {/* Impact section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Waste Distribution by Type</h2>
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
              <p className="text-center text-gray-500">No data to display.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-10 text-green-700">Impact Summary</h2>
            <ul className="space-y-2">
              <li className="text-gray-700">🌬️ CO₂ Prevented: <strong>{stats.co2Saved} kg</strong></li>
              <li className="text-gray-700">📦 Total Waste Collected: <strong>{stats.totalWaste} kg</strong></li>
              <li className="text-gray-700">📥 Total Claims Made: <strong>{stats.totalClaims}</strong></li>
            </ul>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-2xl font-semibold mb-14 text-green-700">Waste Breakdown by Type</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.chartData || []}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity">
                {stats.chartData?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-lg text-gray-500 mb-1">{label}</p>
    <h2 className="text-xl font-bold text-green-800">{value}</h2>
  </div>
);

export default CollectorDashboard;
