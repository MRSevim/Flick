import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useUserContext } from "./Contexts/UserContext";
import { Login } from "./Login";
import { Modal } from "bootstrap";
import { useCreateArticle } from "./Hooks/ArticleHooks/UseCreateArticle";
import ls from "localstorage-slim";

export const CreateAnArticle = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [initialContent, setInitialContent] = useState(
    "<p>Start by replacing this.</p>"
  );
  const navigate = useNavigate();
  const [user] = useUserContext();
  const { createArticle, isLoading: isLoadingArticle } = useCreateArticle();
  const myModalRef = useRef(null);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    const user = JSON.parse(ls.get("user"));
    if (user) {
      setMyId(user._id);
    }
    const localStorageContent = JSON.parse(
      localStorage.getItem("editor-content")
    );
    if (localStorageContent) {
      setInitialContent(localStorageContent);
    }

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
    if (editorRef.current && user) {
      const res = await createArticle(
        DOMPurify.sanitize(title),
        DOMPurify.sanitize(editorRef.current.getContent()),
        false
      );
      if (res.ok) {
        navigate("/article/user/" + myId);
      }
    }
    if (!user) {
      myModalRef.current.show();
    }
  };

  const saveDraft = async () => {
    if (editorRef.current && user) {
      const res = await createArticle(
        DOMPurify.sanitize(title),
        DOMPurify.sanitize(editorRef.current.getContent()),
        true
      );
      if (res.ok) {
        navigate("/my-articles");
      }
    }
    if (!user) {
      myModalRef.current.show();
    }
  };

  return (
    <>
      <div className="create-an-article container mt-3">
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
        <Editor
          tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={initialContent}
          init={{
            height: 600,
            content_style: "body { font-family:Lora,serif; color:black}",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "codesample",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "image",
              "code",
            ],
          }}
          onEditorChange={(newValue, editor) => {
            let content = editor.getContent();
            localStorage.setItem("editor-content", JSON.stringify(content));
          }}
        ></Editor>
        <div className="mt-3 d-flex justify-content-center">
          <button className="btn btn-lg me-3 btn-warning" onClick={saveDraft}>
            Save Draft
          </button>
          <button
            className="btn btn-lg btn-warning"
            disabled={isLoadingArticle}
            onClick={submit}
          >
            Submit
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
