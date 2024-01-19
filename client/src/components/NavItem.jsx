import React from "react";

function NavItem({name, url}){

    return (<div>
      <li className="nav-item navigation-link">
    <a className="nav-link navigation-link" href={url}>{name}</a><br />
    </li>
    </div>)
}

export default NavItem;