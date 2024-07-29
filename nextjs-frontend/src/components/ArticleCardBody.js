import links from "@/utils/Links";
import Link from "next/link";
import { extractExcerptFromHTML } from "@/utils/HelperFuncs";
import { Jost } from "next/font/google";

export const jost = Jost({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const ArticleCardBody = ({ classes, article, link, children = [] }) => {
  return (
    <div className={"card-body " + classes}>
      <h5 className="card-title" title={article.title}>
        {children}{" "}
        <Link href={link} className={"unstyled-link " + jost.className}>
          <span className=" hovered-link">
            {article.title.substring(0, 50)}
            {article.title.length > 50 && "..."}
          </span>
        </Link>
      </h5>
      <div className="mb-2">
        {article.tags?.map((tag, i) => {
          return (
            <Link href={links.tag(tag)} key={i} className="me-1">
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
