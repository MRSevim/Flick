import React, { useEffect, useRef, useState } from "react";
import { useGetNotifications } from "../Hooks/NotificationHooks/UseGetNotifications";
import { Link } from "react-router-dom";
import classNames from "classnames";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useClearNotifications } from "../Hooks/NotificationHooks/UseClearNotifications";
import notificationApi from "../Utils/NotificationApiFunctions";
import links from "../Utils/Links";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const { getNotifications, isLoading } = useGetNotifications();
  const wrapperRef = useRef(null);
  const { clearNotifications, isLoading: clearLoading } =
    useClearNotifications();

  const getUnreadLength = (notifications) => {
    return notifications?.filter((notification) => {
      return !notification.read;
    })?.length;
  };

  const clear = async () => {
    const response = await clearNotifications();
    if (response.ok) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    const get = async () => {
      const { response, json } = await getNotifications();
      if (response.ok) {
        setNotifications(json);
      }
    };
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="me-3 position-relative">
      <i
        className="bi bi-bell-fill h4 position-relative pointer"
        onClick={() => {
          setOpen((prev) => !prev);
          notificationApi.markAsRead();
        }}
      >
        {isLoading && (
          <div className="lds-ellipsis position-absolute top-0 start-100 translate-middle">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {getUnreadLength(notifications) > 0 && (
          <div className="fs-6 bg-secondary text-white rounded-circle position-absolute top-0 start-100 translate-middle px-1 fst-normal">
            {getUnreadLength(notifications)}
          </div>
        )}
      </i>
      {open && (
        <div className="position-absolute border border-info bg-primary notifications-container overflow-auto p-1">
          {notifications?.length === 0 && (
            <div className="d-flex justify-content-center fw-bold">
              No notifications
            </div>
          )}
          {notifications?.length > 0 &&
            notifications?.map((notification) => {
              return (
                <li
                  key={notification._id}
                  className={classNames({
                    "my-1 p-2 rounded": true,
                    "bg-secondary text-white": !notification.read,
                  })}
                >
                  {notification.users[0].username && (
                    <Link
                      className={classNames({
                        "d-inline unstyled-link fw-bold": true,
                        "text-white": !notification.read,
                      })}
                      to={links.publicUser(notification.users[0]._id)}
                    >
                      {notification.users[0].username}
                    </Link>
                  )}
                  {notification.users.length > 1 && (
                    <span>
                      {" "}
                      and {notification.users.length - 1}{" "}
                      {notification.users.length - 1 > 1 ? "others" : "other"}
                    </span>
                  )}
                  {notification.action === "follow" && " started following you"}
                  {notification.action === "like" && " liked your article: "}
                  {notification.action === "comment" &&
                    " commented on your article: "}
                  {notification.action === "release" &&
                    " released an article: "}
                  {notification.target && (
                    <>
                      <br />
                      <Link
                        title={notification.target.title}
                        className={classNames({
                          "unstyled-link ms-1 fw-bold": true,
                          "text-white": !notification.read,
                        })}
                        to={links.article(notification.target._id)}
                      >
                        {notification.target.title.substring(0, 30)}
                        {notification.target.title.length > 40 && "..."}
                      </Link>
                    </>
                  )}
                  <br />
                  <div className="text-end me-1">
                    {timeAgo.format(new Date(notification.created))}
                  </div>
                </li>
              );
            })}
          {notifications?.length > 0 && (
            <div className="d-flex justify-content-center">
              <button
                onClick={clear}
                disabled={clearLoading}
                className="btn btn-info"
              >
                {" "}
                Clear Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};