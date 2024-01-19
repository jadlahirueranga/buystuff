import React, { useState, useEffect } from "react";
import NavItem from "./NavItem";
import NotificationButton from "./NotificationButton.jsx";



function Navbar({ auth })
{
  const apiUrl = window.__API_PROXY__;
  let userUrl;
  if (auth.user && typeof auth.user._id !== 'undefined') {
    userUrl = `${apiUrl}/user/${auth.user._id}`;
  }

  return (
    <div className="navbar-movement">
      <nav className="navbar navbar-expand-lg bg-custom">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ml-auto">
              {/*admin and moderator exclusive*/}
              {(auth.admin || auth.mod) ? (
                <>
                  <NavItem name="Create Accounts" url="/register" />
                  <NavItem name="Control Panel" url="/dashboard" />
                </>
              ) : (
                <></>
              )}
              {/*for authenticated users who aren't authenticated */}
              {!auth.auth ? (
                <>
                  <NavItem name="Login or Sign Up" url="/login" />
                  <NavItem name="Home" url="/home" />
                </>
              ) : (
                <>
                  {/*exclusive to authenticated users */}
                  <NavItem name="Home" url="/home" />
                 
                  {/* <NavItem name="Flowers" url="/flowers" /> */}
                  <NavItem name="Messages" url="/messagehistory" />
                  <NavItem name="Post an AD" url="/post" />
                  <NavItem name="Get Support" url="/forumpostlist" />
                  {/* <NavItem name="Quiz" url="/quiz" /> */}
                  {/* <NavItem name="About Us" url="/about" /> */}
                  <NavItem name="Logout" url="/logout" />
                </>
              )}
            </ul>
            {auth.auth ? (<>
              {
                /*Notifications */
              }
              <div style={{ marginLeft: 'auto' }}>Logged in as <a href={userUrl}>{auth.user.name}</a></div>
              <NotificationButton notifications={auth.user.notifications} />
            </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
