export const GenericDeleteButton = ({ disabled, classes, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={"btn btn-danger " + classes}
    >
      <i className="bi bi-trash-fill"></i>
    </button>
  );
};
