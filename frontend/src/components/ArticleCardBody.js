import links from "@/utils/Links";
import Link from "next/link";
import {
  addWhiteText,
  createShortenedTitle,
  extractExcerptFromHTML,
} from "@/utils/HelperFuncs";
import { Jost } from "next/font/google";
import { useDarkModeContext } from "@/contexts/DarkModeContext";

export const jost = Jost({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const ArticleCardBody = ({ classes, article, link, children = [] }) => {
  const [darkMode] = useDarkModeContext();
  return (
    <div className={"card-body " + classes}>
      <h5 className="card-title" title={article.title}>
        {children}{" "}
        <Link href={link} className={"unstyled-link " + jost.className}>
          <span className=" hovered-link">
            {createShortenedTitle(article.title, 70)}
          </span>
        </Link>
      </h5>
      <div className="mb-2">
        {article.tags?.map((tag, i) => {
          return (
            <Link
              href={links.tag(tag)}
              key={i}
              className={"me-1 text-info " + addWhiteText(darkMode)}
            >
              #{tag}
            </Link>
          );
        })}
      </div>
      <div>
        <p
          className={"card-text article-card-inner-html " + jost.className}
          dangerouslySetInnerHTML={{
            __html: extractExcerptFromHTML(article.content.trim()),
          }}
        ></p>

        <Link href={link} className="unstyled-link ">
          <span className="hovered-link">Read more...</span>
        </Link>
      </div>
    </div>
  );
};
