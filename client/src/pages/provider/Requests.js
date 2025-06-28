import React from "react";
import ProviderNavbar from "../../components/ProviderNavbar";

const Requests = () => {
  return (
    <>
        <ProviderNavbar />
        <div className="p-4">
        <h1 className="text-2xl text-center font-semibold">Requests</h1>
        <p className="mt-2 text-center">Receive Requests here.</p>
        </div>
    </>
  );
};

export default Requests;
