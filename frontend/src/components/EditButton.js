import Link from "next/link";

export const EditButton = ({ href, classes }) => {
  return (
    <Link href={href} className={"btn btn-warning " + classes}>
      <i className="bi bi-pencil-fill"></i>
    </Link>
  );
};
