export const RoleBanner = ({ role }) => {
  const adminOrMod = role === "admin" || role === "mod";

  if (!adminOrMod) {
    return;
  }

  return (
    <div className="my-2 d-flex justify-content-center">
      <div className="p-1 bg-warning rounded text-info">{role}</div>
    </div>
  );
};
