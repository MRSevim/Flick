import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { createShortenedTitle, envVariables } from "@/utils/HelperFuncs";

export const Share = ({ article }) => {
  let url;
  if (typeof window !== "undefined") {
    url = location.href;
  }

  const title = article.title;
  const createQuote = (title) => {
    return `Check the article "${title}" on ${envVariables.websiteName}.`;
  };

  return (
    <div className="d-flex flex-column">
      <h4>Share this article on:</h4>
      <div className="d-flex">
        <div className="me-2">
          <FacebookShareButton
            url={url}
            quote={createQuote(title)}
            hashtag={"#writing"}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
        <div className="me-2">
          <TwitterShareButton
            url={url}
            title={createQuote(createShortenedTitle(title, 100))}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
        <div className="me-2">
          <LinkedinShareButton url={url}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
};
