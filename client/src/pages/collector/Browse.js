import React from "react";
import CollectorNavbar from "../../components/CollectorNavbar";

const Browse = () => {
  return (
  <>
    <CollectorNavbar />
    <div className="p-4">
      <h1 className="text-2xl text-center font-semibold">Browse</h1>
      <p className="mt-2 text-center">Welcome! This will show Browse content.</p>
    </div>
  </>
  );
};

export default Browse;
