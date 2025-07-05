import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import ProviderNavbar from "../../components/ProviderNavbar";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#F44336", "#607D8B"];

const impactFactors = {
  plastic: { co2: 1.5 },
  paper: { trees: 0.017 },
  metal: { co2: 3 },
  organic: { co2: 0.25 },
};

const ProviderDashboard = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/waste/my", {
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold text-green-700 mb-14 text-center">Provider Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Waste Provided" value={`${stats.totalCollectedQty || 0} kg`} />
          <StatCard label="Active Listings" value={stats.activeListings || 0} />
          <StatCard label="Collected Listings" value={stats.collectedListings || 0} />
        </div>

        {/* Impact section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Collected Waste Distribution</h2>
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
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-10 text-green-700">Environmental Impact</h2>
            <ul className="space-y-2">
              <li className="text-gray-700 text-lg">🌬️ CO₂ Prevented: <strong>{stats.co2Saved} kg</strong></li>
              <li className="text-gray-700 text-lg">🌳 Trees Saved: <strong>{stats.treesSaved}</strong></li>
              <li className="text-gray-700 text-lg">📦 Total Waste Provided: <strong>{stats.totalCollectedQty} kg</strong></li>
            </ul>
          </div>
        </div>

        {/* Bar Chart Full Width */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-2xl font-semibold mb-14 text-green-700">Collected Waste Breakdown by Type</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.chartData || []}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity">
                {(stats.chartData || []).map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default ProviderDashboard;
