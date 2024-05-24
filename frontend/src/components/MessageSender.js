import React, { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import Autocomplete from "@mui/material/Autocomplete";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";
import { ImageComponent } from "./ImageComponent";
import { Link } from "react-router-dom";

export const MessageSender = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    _id: null,
  });
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("123");
  const [options, setOptions] = useState([]);
  const { searchAll, isLoading } = useSearchAll();

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(user.username);
      setOptions(json.users);
    };

    if (user.username.trim()) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username]);

  return (
    <div className="d-flex justify-content-center ">
      <form className="m-5 w-100">
        {children}
        <div className="form-group">
          <label className="w-100">
            To:
            <Autocomplete
              freeSolo
              options={isLoading ? [] : options}
              inputValue={user.username}
              getOptionLabel={(option) => option.username}
              renderOption={(props, option, state, ownerState) => (
                <Link
                  onClick={() => {
                    setUser({
                      username: option.username,
                      _id: option._id,
                    });
                  }}
                  className="m-3 d-flex align-items-center"
                  key={option._id}
                >
                  {option.username && (
                    <ImageComponent
                      src={option.image}
                      classes={"profile-img-mini me-2"}
                    />
                  )}

                  <p className="mb-1">{ownerState.getOptionLabel(option)}</p>
                </Link>
              )}
              onInputChange={(event, newInputValue) => {
                setUser((prev) => {
                  return { ...prev, username: newInputValue };
                });
                if (!newInputValue.trim()) {
                  setOptions([]);
                  setUser({
                    username: "",
                    _id: null,
                  });
                }
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref} className="d-flex">
                  <input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                      }
                    }}
                    {...params.inputProps}
                    type="search"
                    className="form-control"
                    placeholder="Search User..."
                    aria-label="Search User"
                  ></input>
                </div>
              )}
            />
          </label>
        </div>
        <div className="form-group">
          <label className="w-100">
            Subject:
            <input
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              className="form-control form-control-lg"
              type="text"
              required
            />
          </label>
        </div>
        <div>
          Message:
          <Editor
            containerProps={{
              style: { height: "250px" },
            }}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </div>
      </form>
    </div>
  );
};
