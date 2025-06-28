import React from "react";
import ProviderNavbar from "../../components/ProviderNavbar";

const ProviderDashboard = () => {
  return (
    <>
        <ProviderNavbar />
        <div className="p-4">
        <h1 className="text-2xl text-center font-semibold">Provider Dashboard</h1>
        <p className="mt-2 text-center">Welcome! This will show provider specific content.</p>
        </div>
    </>
  );
};

export default ProviderDashboard;
