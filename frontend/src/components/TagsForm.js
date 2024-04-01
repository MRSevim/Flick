import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tags } from "../Utils/Tags";

export const TagsForm = ({ classes, tags, onTagsChange }) => {
  const [, setTags] = useState(tags || []);

  const handleTagsChange = (event, newTags) => {
    setTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <Autocomplete
      className={classes}
      multiple
      id="tags-outlined"
      options={Tags}
      getOptionLabel={(option) => option}
      defaultValue={tags}
      onChange={handleTagsChange}
      filterSelectedOptions
      renderInput={(params) => <TextField {...params} label="Tags" />}
    />
  );
};
