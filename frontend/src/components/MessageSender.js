import React, { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import Autocomplete from "@mui/material/Autocomplete";
import { useSearchAll } from "../Hooks/SearchHooks/UseSearchAll";
import { ImageComponent } from "./ImageComponent";
import { Link } from "react-router-dom";
import { useSendPm } from "../Hooks/PmHooks/UseSendPm";
import { Popup } from "./Popup";

export const MessageSender = ({
  children,
  setPms,
  pms,
  type,
  page,
  open,
  searchParams,
  setSearchParams,
}) => {
  const [subject, setSubject] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState([]);
  const { searchAll, isLoading } = useSearchAll();
  const {
    sendPm,
    isLoading: sendLoading,
    error,
    setError,
    successMessage,
  } = useSendPm();
  const username = searchParams.get("username") || "";
  const id = searchParams.get("_id");
  const subjectInUrl = searchParams.get("subject");
  useEffect(() => {
    if (subjectInUrl?.trim()) {
      setSubject(subjectInUrl);
    }
  }, [subjectInUrl]);

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(username);
      setOptions(json.users);
    };

    if (username.trim() && username !== selectedUsername) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id.trim() || !username.trim()) {
      setError("Please select a user from dropdown menu");
      return;
    }
    if (!message.trim()) {
      setError("Please type a message");
      return;
    }
    const { response, json } = await sendPm(id, subject, message);

    if (response && response.ok) {
      if (type === "sent" && page === 1)
        setPms((prevPms) => [json.pm, ...prevPms]);
    }
  };

  return (
    <div className="d-flex justify-content-center ">
      <form onSubmit={handleSubmit} className="m-5 w-90">
        {children}
        <div className="form-group">
          <label className="w-100">
            To:
            <Autocomplete
              freeSolo
              options={isLoading ? [] : options}
              inputValue={username}
              getOptionLabel={(option) =>
                option["username"] ? option["username"] : option
              }
              renderOption={(props, option, state, ownerState) => (
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedUsername(option.username);
                    searchParams.set("username", option.username);
                    searchParams.set("_id", option._id);
                    setSearchParams(searchParams);

                    setOptions([]);
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
                searchParams.set("username", newInputValue);
                searchParams.set("_id", "");
                setSearchParams(searchParams);

                if (!newInputValue.trim()) {
                  setOptions([]);
                  searchParams.set("username", "");
                  searchParams.set("_id", "");
                  setSearchParams(searchParams);
                }
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref} className="d-flex">
                  <input
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
        <input
          disabled={sendLoading}
          className="btn btn-secondary mt-3 w-100"
          type="submit"
          value="Send"
        />
        <div className="d-flex justify-content-center">
          {error && (
            <>
              <Popup message={error} type="danger" />
            </>
          )}
          {successMessage && (
            <>
              <Popup message={successMessage} type="success" />
            </>
          )}
        </div>
      </form>
    </div>
  );
};
