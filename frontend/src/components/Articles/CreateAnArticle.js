import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import React from "react";
import { useUserContext } from "../../Contexts/UserContext";
import { Login } from "../Login";
import { useCreateArticle } from "../../Hooks/ArticleHooks/UseCreateArticle";
import links from "../../Utils/Links";
import { EditorForm } from "../EditorForm";
import { ModalWrapper } from "../ModalWrapper";
import { envVariables } from "../../Utils/HelperFuncs";

export const CreateAnArticle = () => {
  const localStorageContent = JSON.parse(
    localStorage.getItem("editor-content")
  );
  const [modalTriggered, setModalTriggered] = useState(false);
  const [actionToRerun, setActionToRerun] = useState("");
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
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(envVariables.defaultArticleImage);
  const [ref, setRef] = useState(null);

  const onTagsChange = (newTags) => {
    setTags(newTags);
  };

  useEffect(() => {
    const localStorageTitle = JSON.parse(localStorage.getItem("article-title"));
    if (localStorageTitle) {
      setTitle(localStorageTitle);
    }
  }, []);

  useEffect(() => {
    if (modalTriggered && user) {
      if (actionToRerun === "saveDraft") {
        saveDraft();
      } else if (actionToRerun === "submit") {
        submit();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, modalTriggered, actionToRerun]);

  const submit = async () => {
    if (content && user) {
      const res = await createArticle(
        DOMPurify.sanitize(title),
        DOMPurify.sanitize(content),
        false,
        tags,
        image
      );
      if (res.ok) {
        navigate(links.allArticles(user._id));
      }
    }
    if (!user) {
      ref.current.show();
      setModalTriggered(true);
      setActionToRerun("submit");
    }
  };

  const saveDraft = async () => {
    if (content && user) {
      const res = await createArticle(
        DOMPurify.sanitize(title),
        DOMPurify.sanitize(content),
        true,
        tags
      );
      if (res.ok) {
        navigate(links.allDrafts(user._id));
      }
    }
    if (!user) {
      ref.current.show();
      setModalTriggered(true);
      setActionToRerun("saveDraft");
    }
  };

  const handleEditorChange = (content) => {
    setContent(content);
    localStorage.setItem("editor-content", JSON.stringify(content));
  };
  const removeImage = () => {
    setImage(envVariables.defaultArticleImage);
  };

  return (
    <>
      <EditorForm
        removeButtonVisible={image !== envVariables.defaultArticleImage}
        type={"create"}
        title={title}
        setTitle={setTitle}
        image={image}
        setImage={setImage}
        onTagsChange={onTagsChange}
        initialContent={initialContent}
        handleEditorChange={handleEditorChange}
        setContent={setContent}
        isLoading={isLoading}
        saveDraft={saveDraft}
        removeImage={removeImage}
        submit={submit}
      />
      <ModalWrapper id={"loginModal"} setRef={setRef}>
        <Login
          type={"modal"}
          onHideModal={() => {
            ref.current.hide();
          }}
        >
          <button
            type="button"
            className="btn-close bg-light position-absolute top-0 start-0 m-1"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </Login>
      </ModalWrapper>
    </>
  );
};
