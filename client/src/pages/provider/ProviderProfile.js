import React from "react";
import ProviderNavbar from "../../components/ProviderNavbar";

const ProviderProfile = () => {
  return (
    <>
        <ProviderNavbar />
        <div className="p-4">
        <h1 className="text-2xl text-center font-semibold">ProviderProfile</h1>
        <p className="mt-2 text-center">Welcome to ProviderProfile</p>
        </div>
    </>
  );
};

export default ProviderProfile;
