import React from "react";
import CollectorNavbar from "../../components/CollectorNavbar";

const MyRequests = () => {
  return (
  <>
    <CollectorNavbar />
    <div className="p-4">
      <h1 className="text-2xl text-center font-semibold">MyRequests</h1>
      <p className="mt-2 text-center">Welcome! This will show MyRequests</p>
    </div>
  </>
  );
};

export default MyRequests;
