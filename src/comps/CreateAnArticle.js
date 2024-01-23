import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export const CreateAnArticle = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(
    "<p>Start by replacing this.</p>"
  );

  useEffect(() => {
    const localStorageContent = JSON.parse(
      localStorage.getItem("editor-content")
    );
    if (localStorageContent) {
      setInitialContent(localStorageContent);
    }
  }, []);

  const submit = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getContent());
    }
  };

  const saveDraft = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <div className="create-an-article container mt-3">
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
    </>
  );
};
