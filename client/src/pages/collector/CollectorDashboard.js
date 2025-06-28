import React from "react";
import CollectorNavbar from "../../components/CollectorNavbar";

const CollectorDashboard = () => {
  return (
  <>
    <CollectorNavbar />
    <div className="p-4">
      <h1 className="text-2xl text-center font-semibold">Collector Dashboard</h1>
      <p className="mt-2 text-center">Welcome! This will show collector specific content.</p>
    </div>
  </>
  );
};

export default CollectorDashboard;
