import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tags } from "@/utils/HelperFuncs";

export const TagsForm = ({ classes, tags, onTagsChange }) => {
  const handleTagsChange = (event, newTags) => {
    onTagsChange(newTags);
  };

  return (
    <Autocomplete
      className={classes}
      multiple
      id="tags-outlined"
      options={Tags}
      getOptionLabel={(option) => option}
      value={tags || []}
      onChange={handleTagsChange}
      filterSelectedOptions
      renderInput={(params) => <TextField {...params} label="Tags" />}
    />
  );
};
