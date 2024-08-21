import { LikeButton } from "../LikeButton";
import { EditButton } from "../EditButton";
import { DeleteButton } from "../DeleteButton";
import links from "@/utils/Links";
import { Image } from "../Image";
import { ArticleCardBody } from "../ArticleCardBody";
import { addDarkBg } from "@/utils/HelperFuncs";
import { useDarkModeContext } from "@/contexts/DarkModeContext";

export const ArticleItem = ({
  deleteManyLoading,
  article,
  isDraft,
  user,
  myArticles,
  value = false,
  updateValue = () => {},
}) => {
  const [darkMode] = useDarkModeContext();

  const handleCheckboxChange = () => {
    updateValue(!value, article._id);
  };

  return (
    <div key={article._id} className="col col-12 col-md-6 col-lg-4">
      <div className={"card h-100 article-card " + addDarkBg(darkMode)}>
        <ArticleCardBody
          classes="my-4"
          article={article}
          link={
            !isDraft
              ? links.article(article._id)
              : links.edit(article._id, true)
          }
        >
          <div>
            {(myArticles || user?.role === "mod" || user?.role === "admin") && (
              <DeleteButton
                classes="p-1 m-1 position-absolute top-0 end-0"
                article={article}
                deleteManyLoading={deleteManyLoading}
              />
            )}
            {myArticles && (
              <>
                <input
                  className="form-check-input position-absolute top-0 start-0 m-1"
                  type="checkbox"
                  checked={value}
                  onChange={handleCheckboxChange}
                />
                <EditButton
                  classes="p-1 m-1 position-absolute bottom-0 end-0"
                  href={links.edit(article._id, isDraft)}
                />
              </>
            )}
          </div>
          {!isDraft && (
            <LikeButton
              classes="p-1 m-1 position-absolute bottom-0 start-0"
              article={article}
            />
          )}
          <div className="my-2 image-wrapper">
            <Image src={article.image} classes="w-auto h-100 mw-100 mh-100" />
          </div>
        </ArticleCardBody>
      </div>
    </div>
  );
};
