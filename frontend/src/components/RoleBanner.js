import React from "react";

export const RoleBanner = ({ role }) => {
  const adminOrMod = role === "admin" || role === "mod";
  return (
    <div className="my-2 d-flex justify-content-center">
      {adminOrMod && (
        <div className="p-1 bg-warning rounded text-info">{role}</div>
      )}
    </div>
  );
};
