"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { useUserContext } from "@/contexts/UserContext";
import { Login } from "../Login/Login";
import { EditorForm } from "../EditorForm";
import { ModalWrapper } from "../ModalWrapper";
import { envVariables } from "@/utils/HelperFuncs";
import { useCreateArticle } from "@/hooks/UseCreateArticle";

export const CreateAnArticle = () => {
  const localStorageContent = JSON.parse(
    localStorage.getItem("editor-content")
  );
  const localStorageTitle = JSON.parse(localStorage.getItem("article-title"));
  const [modalTriggered, setModalTriggered] = useState(false);
  const [actionToRerun, setActionToRerun] = useState("");
  const [title, setTitle] = useState(localStorageTitle || "");
  const [content, setContent] = useState(null);
  const [initialContent] = useState(
    localStorageContent
      ? localStorageContent
      : "<p>Start by replacing this.</p>"
  );
  const router = useRouter();
  const [user] = useUserContext();
  const { createArticle, isLoading } = useCreateArticle();
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(envVariables.defaultArticleImage);
  const [ref, setRef] = useState(null);

  const onTagsChange = (newTags) => {
    setTags(newTags);
  };

  useEffect(() => {
    if (modalTriggered && user) {
      if (actionToRerun === "saveDraft") {
        saveDraft();
      } else if (actionToRerun === "submit") {
        submit();
      }
      setModalTriggered(false);
    }
  }, [user, modalTriggered, actionToRerun]);

  const submit = async () => {
    if (!user) {
      ref.current.show();
      setModalTriggered(true);
      setActionToRerun("submit");
      return;
    }

    await createArticle(
      DOMPurify.sanitize(title),
      DOMPurify.sanitize(content),
      false,
      tags,
      image,
      user._id
    );
  };

  const saveDraft = async () => {
    if (!user) {
      ref.current.show();
      setModalTriggered(true);
      setActionToRerun("saveDraft");
      return;
    }

    await createArticle(
      DOMPurify.sanitize(title),
      DOMPurify.sanitize(content),
      true,
      tags,
      image,
      user._id
    );
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
        tags={tags}
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
