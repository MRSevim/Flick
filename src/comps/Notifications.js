import React, { useEffect, useState } from "react";
import { useGetNotifications } from "./Hooks/NotificationHooks/UseGetNotifications";
import { Link } from "react-router-dom";
import classNames from "classnames";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const { getNotifications, isLoading } = useGetNotifications();

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

  return (
    <div className="me-3 position-relative">
      <i
        className="bi bi-bell-fill h4 position-relative pointer"
        onClick={() => {
          setOpen((prev) => !prev);
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
        {notifications?.filter((notification) => {
          return !notification.read;
        }).length && (
          <div className="fs-6 bg-danger rounded-circle position-absolute top-0 start-100 translate-middle px-1">
            {
              notifications.filter((notification) => {
                return !notification.read;
              }).length
            }
          </div>
        )}
      </i>
      {open && (
        <div className="position-absolute border border-dark bg-white text-dark notifications-container p-1">
          {notifications.length &&
            notifications?.map((notification) => {
              return (
                <li
                  key={notification._id}
                  className={classNames({
                    "my-1 rounded": true,
                    "bg-info": !notification.read,
                  })}
                >
                  User{" "}
                  {notification.user && (
                    <Link
                      className="d-inline text-dark link-underline link-underline-opacity-0"
                      to={"/user/" + notification.user.username}
                    >
                      {notification.user.username}
                    </Link>
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
                        className="text-dark link-underline link-underline-opacity-0 ms-1"
                        to={"/article/" + notification.target._id}
                      >
                        {notification.target.title.substring(0, 40)}
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
        </div>
      )}
    </div>
  );
};
