import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEditArticle } from "../../Hooks/ArticleHooks/UseEditArticle";
import { useGetArticle } from "../../Hooks/ArticleHooks/UseGetArticle";
import { useUserContext } from "../../Contexts/UserContext";
import { LoadingRing } from "../LoadingRing";
import { useDeleteArticle } from "../../Hooks/ArticleHooks/UseDeleteArticle";
import links from "../../Utils/Links";
import { EditorForm } from "../EditorForm";
import { envVariables } from "../../Utils/HelperFuncs";

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
  const [removeImageClicked, setRemoveImageClicked] = useState(false);

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

  const save = async (draft) => {
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
    await edit();
  };
  const removeImage = () => {
    setRemoveImageClicked(true);
  };
  useEffect(() => {
    const check = async () => {
      if (removeImageClicked) {
        const response = await editArticle(
          null,
          null,
          isDraft,
          id,
          null,
          envVariables.defaultArticleImage
        );
        if (response.ok) {
          setImage(envVariables.defaultArticleImage);
        }
        setRemoveImageClicked(false);
      }
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, removeImageClicked, setRemoveImageClicked, isDraft]);
  return isLoading ? (
    <div className="container">
      <LoadingRing />
    </div>
  ) : (
    <EditorForm
      removeButtonVisible={image !== envVariables.defaultArticleImage}
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
      removeImage={removeImage}
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
