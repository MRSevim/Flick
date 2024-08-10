export const GenericDeleteSelectedButton = ({ disabled, classes, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={"btn btn-danger " + classes}
    >
      <i className="bi bi-trash-fill"></i> Delete Selected
    </button>
  );
};
