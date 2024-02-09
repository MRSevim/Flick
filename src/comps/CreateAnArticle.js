import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useUserContext } from "./Contexts/UserContext";
import { Login } from "./Login";
import { Modal } from "bootstrap";

export const CreateAnArticle = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState("");
  const [initialContent, setInitialContent] = useState(
    "<p>Start by replacing this.</p>"
  );

  const [user] = useUserContext();
  const myModalRef = useRef(null);

  useEffect(() => {
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

  const submit = () => {
    if (editorRef.current && user) {
      setContent(editorRef.current.getContent());
    }
    if (!user) {
      myModalRef.current.show();
    }
  };

  const saveDraft = () => {
    if (editorRef.current && user) {
      console.log(editorRef.current.getContent());
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
          <button className="btn btn-lg btn-warning" onClick={submit}>
            Submit
          </button>
        </div>
        {content && (
          <div
            className="mt-3 article"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          ></div>
        )}
      </div>

      <div className="modal fade" tabIndex="-1" id="loginModal">
        <div className="modal-dialog">
          <div className="modal-content mt-5">
            <div className="modal-body">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
              <div className="mt-4 mb-5">
                <Login
                  onHideModal={() => {
                    myModalRef.current.hide();
                  }}
                ></Login>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
