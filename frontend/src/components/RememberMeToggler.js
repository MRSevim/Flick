export const RememberMeToggler = ({ rememberMe, setRememberMe }) => {
  return (
    <div className="form-check mb-2">
      <label className="form-check-label">
        <input
          className="form-check-input"
          type="checkbox"
          value={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
    </div>
  );
};
