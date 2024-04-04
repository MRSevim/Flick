import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { EditorComponent } from "../EditorComponent";
import { useEditArticle } from "../../Hooks/ArticleHooks/UseEditArticle";
import { useGetArticle } from "../../Hooks/ArticleHooks/UseGetArticle";
import { useUserContext } from "../../Contexts/UserContext";
import { TagsForm } from "../TagsForm";
import { LoadingRing } from "../LoadingRing";
import { useDeleteArticle } from "../../Hooks/ArticleHooks/UseDeleteArticle";
import { DeleteButton } from "./DeleteButton";
import links from "../../Utils/Links";

export const Edit = () => {
  const [searchParams] = useSearchParams();
  const isDraftstring = searchParams.get("isDraft");
  const isDraft = isDraftstring === "true";
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
      const response = await editArticle(title, content, draft, id, tags);
      if (response.ok) {
        if (isDraft && !draft) {
          setSuccessMessage(
            "Article published. Redirecting to puslished article..."
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
    <div className="container mt-3 pb-4">
      <div className="form-group row mb-3 align-items-center">
        <label htmlFor="title" className="col-sm-1 text-center text-sm-end">
          Title:
        </label>
        <div className="col-sm-10">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            id="title"
            className="form-control"
            type="text"
          />
        </div>
      </div>
      <TagsForm classes={"mx-5 my-3"} onTagsChange={onTagsChange} tags={tags} />
      <EditorComponent
        initialContent={initialContent}
        handleEditorChange={(content) => {
          setContent(content);
        }}
        onInit={(editor) => {
          setContent(editor.getContent());
        }}
      ></EditorComponent>
      <div
        className="mt-3 d-flex justify-content-center
      "
      >
        <DeleteButton
          onClick={deleteArticle}
          deleteLoading={deleteLoading}
          classes={"me-2"}
        />
        <button
          className="btn btn-lg btn-secondary me-2"
          disabled={editLoading}
          onClick={() => {
            save(isDraft);
          }}
        >
          Save
        </button>
        {isDraft && (
          <button
            className="btn btn-lg btn-secondary"
            disabled={editLoading}
            onClick={() => {
              save(false);
            }}
          >
            Publish Article
          </button>
        )}
      </div>
      {successMessage && (
        <div
          ref={successMessageRef}
          className="text-center mt-3 d-flex justify-content-center"
        >
          <p className="m-0 alert alert-success wide-input">{successMessage}</p>
        </div>
      )}
    </div>
  );
};
