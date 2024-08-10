"use client";
import { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import links from "@/utils/Links";
import { envVariables } from "@/utils/HelperFuncs";
import { EditorForm } from "../EditorForm";
import { useRouter } from "next/navigation";
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
  const { editArticle, isLoading } = useEditArticle();

  if (user?._id !== json.user._id) {
    router.push(links.homepage);
  }

  const save = async (draft) => {
    await editArticle(title, content, draft, id, tags, image, isDraft);
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
      tags={tags}
      initialContent={initialContent}
      handleEditorChange={(content) => {
        setContent(content);
      }}
      setContent={setContent}
      editLoading={isLoading}
      save={save}
      isDraft={isDraft}
      removeImage={removeImage}
    ></EditorForm>
  );
};
