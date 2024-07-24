import links from "@/utils/Links";
import Link from "next/link";

export const FollowButtons = ({ followerNumber, followingNumber, id }) => {
  return (
    <>
      <Link href={links.follows(id, "followers", 1)}>
        <button className="btn btn-secondary me-2">
          Followers({followerNumber})
        </button>
      </Link>
      <Link href={links.follows(id, "following", 1)}>
        <button className="btn btn-secondary">
          Following({followingNumber})
        </button>
      </Link>
    </>
  );
};
