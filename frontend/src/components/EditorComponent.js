import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export const EditorComponent = ({
  initialContent,
  onInit,
  handleEditorChange,
}) => {
  return (
    <Editor
      tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
      onInit={(evt, editor) => {
        onInit(editor);
      }}
      initialValue={initialContent}
      init={{
        height: 600,
        content_style: "body {  font-family: 'Jost', sans-serif; color:black}",
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
        ],
      }}
      onEditorChange={(newValue, editor) => {
        let content = editor.getContent();
        handleEditorChange(content);
      }}
    ></Editor>
  );
};
