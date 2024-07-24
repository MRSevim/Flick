import React, { useEffect, useRef, useState } from "react";
import { useGetNotifications } from "../Hooks/NotificationHooks/UseGetNotifications";
import { Link } from "react-router-dom";
import classNames from "classnames";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useClearNotifications } from "../Hooks/NotificationHooks/UseClearNotifications";
import notificationApi from "../Utils/NotificationApiFunctions";
import links from "../Utils/Links";
import { useDarkModeContext } from "../Contexts/DarkModeContext";
import { addDarkBg, getUnreadLength } from "../Utils/HelperFuncs";
import { LoadingDots } from "./LoadingDots";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const { getNotifications, isLoading } = useGetNotifications();
  const wrapperRef = useRef(null);
  const { clearNotifications } = useClearNotifications();
  const [darkMode] = useDarkModeContext();

  const clear = async () => {
    const response = await clearNotifications();
    if (response.ok) {
      setNotifications([]);
    }
  };
  const markAsRead = async () => {
    const response = await notificationApi.markAsRead();
    if (response.ok) {
      setNotifications(
        notifications.map((notification) => {
          return { ...notification, read: true };
        })
      );
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
      {isLoading && <LoadingDots />}
      <div className="position-relative">
        <i
          className={classNames({
            "bi h4 m-0 pointer": true,
            "bi-bell": notifications?.length === 0,
            "bi-bell-fill": notifications?.length > 0,
          })}
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          {" "}
        </i>
        {getUnreadLength(notifications) > 0 && (
          <div className="fs-6 bg-secondary text-white rounded-circle position-absolute top-0 start-100 translate-middle px-1">
            {getUnreadLength(notifications)}
          </div>
        )}
      </div>
      {open && (
        <div
          className={
            "position-absolute rounded border bg-light menu-container overflow-auto"
          }
        >
          <div className="d-flex justify-content-between">
            <div
              onClick={markAsRead}
              className="pointer text-secondary menu-clickable m-2"
            >
              Mark all as read
            </div>
            <div
              onClick={clear}
              className="pointer text-secondary menu-clickable m-2"
            >
              {" "}
              Clear All
            </div>
          </div>
          <div className={"border-top " + addDarkBg(darkMode)}>
            {notifications?.length === 0 && (
              <div className="d-flex justify-content-center border-top p-2">
                No notifications
              </div>
            )}

            {notifications?.length > 0 &&
              notifications?.map((notification) => {
                return (
                  <div
                    key={notification._id}
                    className={classNames({
                      "p-2": true,
                      "unread-notification border-bottom border-light":
                        !notification.read && !darkMode,
                      "unread-nofication-dark-mode border-bottom border-dark":
                        !notification.read && darkMode,
                    })}
                  >
                    {(notification.action === "follow" ||
                      notification.action === "like" ||
                      notification.action === "comment" ||
                      notification.action === "release") && (
                      <>
                        {notification.users[0].username && (
                          <Link
                            to={links.publicUser(notification.users[0]._id)}
                          >
                            {notification.users[0].username}
                          </Link>
                        )}
                        {notification.users.length > 1 && (
                          <span>
                            {" "}
                            and {notification.users.length - 1}{" "}
                            {notification.users.length - 1 > 1
                              ? "others"
                              : "other"}
                          </span>
                        )}
                        {notification.action === "follow" &&
                          " started following you"}
                        {notification.action === "like" &&
                          " liked your article: "}
                        {notification.action === "comment" &&
                          " commented on your article: "}
                        {notification.action === "release" &&
                          " released an article: "}
                        {notification.target && (
                          <>
                            <br />
                            <Link
                              title={notification.target.title}
                              to={links.article(notification.target._id)}
                            >
                              {notification.target.title.substring(0, 40)}
                              {notification.target.title.length > 40 && "..."}
                            </Link>
                          </>
                        )}
                        <br />
                      </>
                    )}
                    {notification.action === "comment deletion" && (
                      <>
                        One of your comments{" "}
                        {notification.target && (
                          <>
                            in{" "}
                            <Link
                              title={notification.target.title}
                              to={links.article(notification.target._id)}
                            >
                              {notification.target.title.substring(0, 40)}
                              {notification.target.title.length > 40 && "..."}
                            </Link>
                          </>
                        )}{" "}
                        have been deleted for following reason:
                        <br />
                        {notification.reasonOfDeletion}
                        <br />
                      </>
                    )}
                    {notification.action === "article deletion" && (
                      <>
                        One of your articles have been deleted for following
                        reason:
                        <br />
                        {notification.reasonOfDeletion}
                        <br />
                      </>
                    )}

                    <div className="text-end fw-lighter">
                      {timeAgo.format(new Date(notification.created))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
