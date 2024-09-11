import { useEffect, useState } from "react";
import { Editor as TinyMceEditor } from "@tinymce/tinymce-react";
import { useDarkModeContext } from "@/contexts/DarkModeContext";

export const Editor = ({ initialContent, onInit, handleEditorChange }) => {
  const [darkMode] = useDarkModeContext();
  const [editorKey, setEditorKey] = useState(0);

  //key change rerenders editor
  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [darkMode]);

  return (
    <TinyMceEditor
      id="123"
      key={editorKey}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      onInit={(evt, editor) => {
        onInit(editor);
      }}
      initialValue={initialContent}
      init={{
        height: 600,
        content_style:
          "code{background-color: #0b5351 !important; color:white!important}body { font-family: 'Jost', sans-serif; color:#092327;" +
          (darkMode
            ? "background-color:#092327 !important;color:#fff}"
            : "} ") +
          (darkMode ? "a{color:#fff}" : "a{color:#092327}"),
        plugins: [
          "fullscreen",
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
        toolbar: [
          "fullscreen|undo redo | styles | alignleft aligncenter alignright alignjustify| bold italic | link image",
        ],
      }}
      onEditorChange={(newValue, editor) => {
        let content = editor.getContent();
        handleEditorChange(content);
      }}
    ></TinyMceEditor>
  );
};
