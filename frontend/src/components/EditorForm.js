import React from "react";
import { TagsForm } from "./TagsForm";
import { EditorComponent } from "./EditorComponent";
import { DeleteButton } from "./Articles/DeleteButton";
import defaultImage from "../Utils/images/default-image.png";

export const EditorForm = ({
  type,
  title,
  setTitle,
  image,
  setImage,
  onTagsChange,
  initialContent,
  handleEditorChange,
  setContent,
  isLoading,
  saveDraft,
  submit,
  deleteArticle,
  deleteLoading,
  editLoading,
  save,
  isDraft,
  children,
}) => {
  return (
    <div className="container mt-4 pb-4">
      <div className="form-group row my-3 align-items-center">
        <label htmlFor="title" className="col-sm-1 text-center text-sm-end">
          Title:
        </label>
        <div className="col-sm-11">
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
      <div className="form-group row">
        <div className="col col-12 col-md-3 text-center">
          <img className="w-100" src={image || defaultImage} alt="featured" />
          <div>Image preview</div>
        </div>
        <label className="col col-12 col-md-9 d-flex flex-column justify-content-center">
          Feauted Image URL:
          <input
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
            className="form-control"
            type="url"
          />
        </label>
      </div>
      <TagsForm classes={"my-3"} onTagsChange={onTagsChange} />
      <EditorComponent
        initialContent={initialContent}
        handleEditorChange={handleEditorChange}
        onInit={(editor) => {
          setContent(editor.getContent());
        }}
      ></EditorComponent>
      <div className="mt-3 d-flex justify-content-center">
        {type === "create" && (
          <>
            <button
              className="btn btn-lg me-3 btn-secondary"
              disabled={isLoading}
              onClick={saveDraft}
            >
              Save Draft
            </button>
            <button
              className="btn btn-lg btn-secondary"
              disabled={isLoading}
              onClick={submit}
            >
              Publish
            </button>
          </>
        )}
        {type === "edit" && (
          <>
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
          </>
        )}
      </div>
      {children && children}
    </div>
  );
};
