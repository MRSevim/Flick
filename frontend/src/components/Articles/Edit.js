import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEditArticle } from "../../Hooks/ArticleHooks/UseEditArticle";
import { useGetArticle } from "../../Hooks/ArticleHooks/UseGetArticle";
import { useUserContext } from "../../Contexts/UserContext";
import { LoadingRing } from "../LoadingRing";
import { useDeleteArticle } from "../../Hooks/ArticleHooks/UseDeleteArticle";
import links from "../../Utils/Links";
import { EditorForm } from "../EditorForm";

export const Edit = () => {
  const [searchParams] = useSearchParams();
  const isDraftString = searchParams.get("isDraft");
  const isDraft = isDraftString === "true";
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [user] = useUserContext();
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { editArticle, isLoading: editLoading } = useEditArticle();
  const { getArticle, isLoading } = useGetArticle();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const successMessageRef = useRef(null);
  const { deleteArticle: deleteArticleCall, isLoading: deleteLoading } =
    useDeleteArticle();
  const [image, setImage] = useState("");

  const deleteArticle = async () => {
    const response = await deleteArticleCall(id);
    if (response.ok) {
      navigate(
        isDraft ? links.allDrafts(user._id) : links.allArticles(user._id)
      );
    }
  };

  useEffect(() => {
    if (successMessageRef.current) {
      successMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [successMessage]);

  const onTagsChange = (newTags) => {
    setTags(newTags);
  };

  useEffect(() => {
    if (user === undefined) {
      navigate(links.homepage);
      return;
    }

    const get = async () => {
      const { response, json } = await getArticle(id, isDraft);

      if (response.ok) {
        setTitle(json.title);
        setInitialContent(json.content);
        setTags(json.tags);
        setImage(json.image);
        if (user && json) {
          if (user._id !== json.user._id) {
            navigate(links.homepage);
            return;
          }
        }
      }
    };

    get();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, user]);

  const save = (draft) => {
    const edit = async () => {
      setSuccessMessage(null);
      const response = await editArticle(
        title,
        content,
        draft,
        id,
        tags,
        image
      );
      if (response.ok) {
        if (isDraft && !draft) {
          setSuccessMessage(
            "Article published. Redirecting to published article..."
          );
          setTimeout(() => {
            navigate(links.article(id));
          }, 3000);
        } else {
          setSuccessMessage("Saved...");
        }
      }
    };
    edit();
  };
  return isLoading ? (
    <div className="container mt-5">
      <LoadingRing />
    </div>
  ) : (
    <EditorForm
      type={"edit"}
      title={title}
      setTitle={setTitle}
      image={image}
      setImage={setImage}
      onTagsChange={onTagsChange}
      initialContent={initialContent}
      handleEditorChange={(content) => {
        setContent(content);
      }}
      setContent={setContent}
      deleteArticle={deleteArticle}
      deleteLoading={deleteLoading}
      editLoading={editLoading}
      save={save}
      isDraft={isDraft}
    >
      {successMessage && (
        <div
          ref={successMessageRef}
          className="text-center mt-3 d-flex justify-content-center"
        >
          <p className="m-0 alert alert-success">{successMessage}</p>
        </div>
      )}
    </EditorForm>
  );
};
