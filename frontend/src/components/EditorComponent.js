import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useDarkModeContext } from "../Contexts/DarkModeContext";

export const EditorComponent = ({
  initialContent,
  onInit,
  handleEditorChange,
}) => {
  const [darkMode] = useDarkModeContext();
  const [editorKey, setEditorKey] = useState(0);

  //key change rerenders editor
  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [darkMode]);

  return (
    <Editor
      key={editorKey}
      tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
      onInit={(evt, editor) => {
        onInit(editor);
      }}
      initialValue={initialContent}
      init={{
        height: 600,
        content_style:
          "body { font-family: 'Jost', sans-serif; color:#092327;" +
          (darkMode ? "background-color:#092327;color:#fff}" : "}"),
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
