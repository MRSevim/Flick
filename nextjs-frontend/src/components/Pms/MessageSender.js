import React, { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import Autocomplete from "@mui/material/Autocomplete";
import { useSearchAll } from "@/hooks/UseSearchAll";
import { Image } from "../Image";
import Link from "next/link";
import { useSendPm } from "@/hooks/UseSendPm";
import { Popup } from "../Popup";
import links from "@/utils/Links";

export const MessageSender = ({
  children,
  searchParams,
  router,
  refProp,
  user,
}) => {
  const open = searchParams.get("open") === "true";
  const [selectedUsername, setSelectedUsername] = useState("");
  const [subject, setSubject] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState([]);
  const { searchAll, isLoading } = useSearchAll();
  const { sendPm, isLoading: sendLoading, error, setError } = useSendPm();

  useEffect(() => {
    if (searchParams.get("subject")) {
      setSubject(searchParams.get("subject"));
    }
    if (searchParams.get("username")) {
      setUsername(searchParams.get("username"));
    }
    if (searchParams.get("_id")) {
      setId(searchParams.get("_id"));
    }
  }, [searchParams]);

  useEffect(() => {
    const get = async () => {
      const json = await searchAll(username);
      setOptions(json.users);
    };

    if (username.trim() && selectedUsername !== username) {
      get();
    }
  }, [username]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!id?.trim() || !username?.trim()) {
      setError("Please select a user from dropdown menu");
      return;
    }
    if (!message.trim()) {
      setError("Please type a message");
      return;
    }
    const error = await sendPm(id, subject, message, user._id);
    if (!error) {
      refProp.current.hide();
      router.push(links.pms("sent"));
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
                    setUsername(option.username);
                    setSelectedUsername(option.username);
                    setId(option._id);
                    setOptions([]);
                  }}
                  className="m-3 d-flex align-items-center"
                  key={option._id}
                  href="#"
                >
                  {option.username && (
                    <Image
                      src={option.image}
                      classes={"profile-img-mini me-2"}
                    />
                  )}

                  <p className="mb-1">{ownerState.getOptionLabel(option)}</p>
                </Link>
              )}
              onInputChange={(event, newInputValue) => {
                setUsername(newInputValue);

                if (!newInputValue.trim()) {
                  setOptions([]);
                  setUsername("");
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
              className="form-control"
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
        </div>
      </form>
    </div>
  );
};
