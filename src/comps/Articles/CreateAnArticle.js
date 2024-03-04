import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import React from "react";
import { EditorComponent } from "../EditorComponent";
import { useUserContext } from "../Contexts/UserContext";
import { Login } from "../Login";
import { Modal } from "bootstrap";
import { useCreateArticle } from "../Hooks/ArticleHooks/UseCreateArticle";

export const CreateAnArticle = () => {
  const localStorageContent = JSON.parse(
    localStorage.getItem("editor-content")
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [initialContent] = useState(
    localStorageContent
      ? localStorageContent
      : "<p>Start by replacing this.</p>"
  );
  const navigate = useNavigate();
  const [user] = useUserContext();
  const { createArticle, isLoading } = useCreateArticle();
  const myModalRef = useRef(null);

  useEffect(() => {
    const localStorageTitle = JSON.parse(localStorage.getItem("article-title"));
    if (localStorageTitle) {
      setTitle(localStorageTitle);
    }

    myModalRef.current = new Modal(document.getElementById("loginModal"), {
      backdrop: true,
      focus: true,
      keyboard: true,
    });
  }, []);

  const submit = async () => {
    if (content && user) {
      const res = await createArticle(
        DOMPurify.sanitize(title),
        DOMPurify.sanitize(content),
        false
      );
      if (res.ok) {
        navigate("/article/user/" + user._id + "/articles");
      }
    }
    if (!user) {
      myModalRef.current.show();
    }
  };

  const saveDraft = async () => {
    if (content && user) {
      const res = await createArticle(
        DOMPurify.sanitize(title),
        DOMPurify.sanitize(content),
        true
      );
      if (res.ok) {
        navigate("/article/user/" + user._id + "/drafts");
      }
    }
    if (!user) {
      myModalRef.current.show();
    }
  };
  const handleEditorChange = (content) => {
    setContent(content);
    localStorage.setItem("editor-content", JSON.stringify(content));
  };

  return (
    <>
      <div className="container mt-3">
        <div className="form-group row mb-3 align-items-center">
          <label htmlFor="title" className="col-sm-1 text-center text-sm-end">
            Title:
          </label>
          <div className="col-sm-10">
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                localStorage.setItem(
                  "article-title",
                  JSON.stringify(e.target.value)
                );
              }}
              id="title"
              className=" form-control"
              type="text"
            />
          </div>
        </div>
        <EditorComponent
          initialContent={initialContent}
          handleEditorChange={handleEditorChange}
          onInit={(editor) => {
            setContent(editor.getContent());
          }}
        ></EditorComponent>
        <div className="mt-3 d-flex justify-content-center">
          <button
            className="btn btn-lg me-3 btn-warning"
            disabled={isLoading}
            onClick={saveDraft}
          >
            Save Draft
          </button>
          <button
            className="btn btn-lg btn-warning"
            disabled={isLoading}
            onClick={submit}
          >
            Publish
          </button>
        </div>
      </div>
      <div className="modal fade" tabIndex="-1" id="loginModal">
        <div className="modal-dialog d-flex justify-content-center">
          <div className="modal-content mt-5" style={{ width: "354px" }}>
            <Login
              onHideModal={() => {
                myModalRef.current.hide();
              }}
            >
              <button
                type="button"
                className="btn-close bg-light position-absolute top-0 start-0 m-1"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </Login>
          </div>
        </div>
      </div>
    </>
  );
};
