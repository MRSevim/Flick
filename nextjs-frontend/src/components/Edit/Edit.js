"use client";
import { useEffect, useState, useRef } from "react";
import { useUserContext } from "@/contexts/UserContext";
import links from "@/utils/Links";
import { envVariables } from "@/utils/HelperFuncs";
import { EditorForm } from "../EditorForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEditArticle } from "@/hooks/UseEditArticle";

export const Edit = ({ json, isDraft }) => {
  const initialContent = json.content;
  const id = json._id;
  const router = useRouter();
  const [user] = useUserContext();
  const [title, setTitle] = useState(json.title);
  const [content, setContent] = useState(null);
  const [tags, setTags] = useState(json.tags);
  const [image, setImage] = useState(json.image);
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("successMessage");
  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const successMessageRef = useRef(null);
  const { editArticle, isLoading } = useEditArticle();

  if (user?._id !== json.user._id) {
    router.push(links.homepage);
  }

  useEffect(() => {
    //this scrolling currently does not work
    if (successMessageRef.current) {
      successMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [successMessage]);

  const setSuccessMessageToUrl = (message) => {
    params.set("successMessage", message);
    router.replace(pathname + "?" + params.toString());
  };

  const save = async (draft) => {
    const edit = async () => {
      setSuccessMessageToUrl("");
      const error = await editArticle(title, content, draft, id, tags, image);
      if (!error) {
        if (isDraft && !draft) {
          setSuccessMessageToUrl(
            "Article published. Redirecting to published article..."
          );
          setTimeout(() => {
            router.push(links.article(id));
          }, 3000);
        } else {
          setSuccessMessageToUrl("Saved...");
        }
      }
    };
    await edit();
  };
  const removeImage = async () => {
    const error = await editArticle(
      null,
      null,
      isDraft,
      id,
      null,
      envVariables.defaultArticleImage
    );
    if (!error) {
      setImage(envVariables.defaultArticleImage);
      setSuccessMessageToUrl("Saved...");
    }
  };

  return (
    <EditorForm
      article={json}
      removeButtonVisible={image !== envVariables.defaultArticleImage}
      type={"edit"}
      title={title}
      setTitle={setTitle}
      image={image}
      setImage={setImage}
      onTagsChange={(newTags) => {
        setTags(newTags);
      }}
      initialContent={initialContent}
      handleEditorChange={(content) => {
        setContent(content);
      }}
      setContent={setContent}
      editLoading={isLoading}
      save={save}
      isDraft={isDraft}
      removeImage={removeImage}
    >
      {successMessage && (
        <div
          ref={successMessageRef}
          className="text-center mt-3 d-flex justify-content-center"
        >
          <p className="m-0 alert alert-success">{successMessage}</p>
        </div>
      )}
    </EditorForm>
  );
};
