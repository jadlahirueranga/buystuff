import React, { useState, useRef, useEffect } from "react";

function NotificationButton({ notifications }) {
  //Button to see notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef();

  const handleClick = () => {
    setShowNotifications(!showNotifications);
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative">
      <button className="btn btn-link text-dark" onClick={handleClick}>
        Notifications {notifications.length > 0 && <span className="badge badge-pill badge-danger"><div className="noti">({notifications.length})</div></span>}
      </button>
      {((notifications.length > 0) && showNotifications) && (
        <div ref={dropdownRef} className="notification-dropdown shadow">
          <ul className="list-group bg-custom">
            {/* Rendering notifications */}
            {notifications.map((notification) => (
              <li key={notification._id.$oid} className="list-group-item">
                <a href="/messagehistory" className="text-decoration-none text-dark">
                  Message "{notification.message.slice(0,10)+"..."}" from {notification.senderName} <sup>on {formatDateTime(parseInt(notification.date))}</sup>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatDateTime(timestamp) {
  //converting date into a string
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

  return date.toLocaleString('en-US', options);
}

export default NotificationButton;
