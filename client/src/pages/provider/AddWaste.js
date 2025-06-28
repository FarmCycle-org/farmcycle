import React from "react";
import ProviderNavbar from "../../components/ProviderNavbar";

const AddWaste = () => {
  return (
    <> 
        <ProviderNavbar /> 
        <div className="p-4">
        <h1 className="text-2xl text-center font-semibold">Add Waste</h1>
        <p className="mt-2 text-center">Welcome! Add Waste listings here.</p>
        </div>
    </>
  );
};

export default AddWaste;
