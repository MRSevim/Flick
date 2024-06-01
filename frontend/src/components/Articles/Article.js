import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArticleSections } from "./ArticleSections";
import { useGetArticle } from "../../Hooks/ArticleHooks/UseGetArticle";
import { useDeleteArticle } from "../../Hooks/ArticleHooks/UseDeleteArticle";
import { useUserContext } from "../../Contexts/UserContext";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { LoadingRing } from "../LoadingRing";
import links from "../../Utils/Links";
import { ImageComponent } from "../ImageComponent";
import { SimilarArticles } from "./SimilarArticles";

export const Article = () => {
  const [user] = useUserContext();
  const { id } = useParams();
  const ref = useRef(null);
  const navigate = useNavigate();
  const { getArticle, isLoading } = useGetArticle();
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [article, setArticle] = useState(null);
  const [myArticle, setMyArticle] = useState(null);
  const { deleteArticle: deleteArticleCall, isLoading: deleteLoading } =
    useDeleteArticle();

  const deleteArticle = async (_id) => {
    const response = await deleteArticleCall(_id, article?.title);
    if (response && response.ok) {
      navigate(links.allArticles(user._id));
    }
  };

  const editArticle = (id) => {
    navigate(links.edit(id, false));
  };

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getArticle(id, false);
      if (response.ok) {
        setArticle(json);
        const created = new Date(json?.createdAt);
        setCreatedAt(created.toLocaleString());
        const updated = new Date(json?.updatedAt);
        setUpdatedAt(updated.toLocaleString());
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (article) {
      if (article.user?._id === user?._id) {
        setMyArticle(true);
      } else {
        setMyArticle(false);
      }
    }
  }, [article, user, setMyArticle]);

  return (
    <div className="container mt-3 pb-4">
      <div className="row justify-content-center">
        {article && (
          <div className="col col-12 col-lg-2">
            <h3 className="">Sections</h3>
            <ArticleSections refProp={ref} />
          </div>
        )}
        {isLoading ? (
          <div className="article col">
            <div className="container mt-5 ">
              <LoadingRing />
            </div>
          </div>
        ) : article ? (
          <div className="article col col-12 col-lg-8 mt-2">
            <ImageComponent src={article.image} />
            <h1 className="article-title">{article.title}</h1>
            <div className="my-2">
              {article.tags?.map((tag, i) => {
                return (
                  <Link to={links.tag(tag)} key={i} className="me-1">
                    #{tag}
                  </Link>
                );
              })}
            </div>
            <div className="mb-2">
              {!myArticle && <LikeButton classes="me-1" article={article} />}
              {myArticle && (
                <>
                  <DeleteButton
                    classes="me-1"
                    onClick={() => {
                      deleteArticle(article._id);
                    }}
                    deleteLoading={deleteLoading}
                  />
                  <EditButton
                    classes="me-1"
                    onClick={() => {
                      editArticle(article._id);
                    }}
                  />
                </>
              )}
            </div>
            <article
              ref={ref}
              className="article-body mb-2"
              dangerouslySetInnerHTML={{
                __html: article.content,
              }}
            ></article>
            <div className="text-end">
              <p>
                <i>
                  Written by{" "}
                  <Link to={links.publicUser(article.user?._id)}>
                    <span className="fw-bold">{article.user?.username}</span>
                  </Link>
                </i>
              </p>
              <p>
                <i>
                  Published <span className="fw-bold">{createdAt}</span>
                </i>
              </p>
              {createdAt !== updatedAt && (
                <p>
                  <i>
                    Last updated <span className="fw-bold">{updatedAt}</span>
                  </i>
                </p>
              )}
            </div>
            <SimilarArticles id={id} />
            <CommentSection article={article} />
          </div>
        ) : (
          <div className="article col"></div>
        )}
        {article && <div className="col col-12 col-lg-2 "></div>}
      </div>
    </div>
  );
};
