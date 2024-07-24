export const DeleteButton = ({ onClick, deleteLoading, classes }) => {
  return (
    <button
      disabled={deleteLoading}
      onClick={onClick}
      className={"btn btn-danger " + classes}
    >
      <i className="bi bi-trash-fill"></i>
    </button>
  );
};
