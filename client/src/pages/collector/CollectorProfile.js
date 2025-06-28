import React from "react";
import CollectorNavbar from "../../components/CollectorNavbar";

const CollectorProfile = () => {
  return (
  <>
    <CollectorNavbar />
    <div className="p-4">
      <h1 className="text-2xl text-center font-semibold">CollectorProfile</h1>
      <p className="mt-2 text-center">Welcome! This will show CollectorProfile</p>
    </div>
  </>
  );
};

export default CollectorProfile;
