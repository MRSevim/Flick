import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorComponent } from "../EditorComponent";
import { useEditArticle } from "../../Hooks/ArticleHooks/UseEditArticle";
import { useGetArticle } from "../../Hooks/ArticleHooks/UseGetArticle";
import { useUserContext } from "../../Contexts/UserContext";

export const Edit = ({ isDraft }) => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [user] = useUserContext();
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { editArticle, isLoading: editLoading } = useEditArticle();
  const { getArticle, isLoading } = useGetArticle();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      navigate("/");
      return;
    }

    const get = async () => {
      const { response, json } = await getArticle(id, isDraft);

      if (response.ok) {
        setTitle(json.title);
        setInitialContent(json.content);
        if (user && json) {
          if (user._id !== json.user._id) {
            navigate("/");
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
      const response = await editArticle(title, content, draft, id);
      if (response.ok) {
        if (draft) {
          setSuccessMessage("Saved...");
        } else {
          setSuccessMessage(
            "Article published. Redirecting to puslished article..."
          );
          setTimeout(() => {
            navigate("/article/" + id);
          }, 3000);
        }
      }
    };
    edit();
  };
  return isLoading ? (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="lds-ring">
        <div></div>
      </div>
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
        <button
          className="btn btn-lg btn-secondary me-2"
          disabled={editLoading}
          onClick={() => {
            save(true);
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
        <div className="text-center mt-3 d-flex justify-content-center">
          <p className="m-0 alert alert-success wide-input">{successMessage}</p>
        </div>
      )}
    </div>
  );
};
