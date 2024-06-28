import React from "react";

function NavItem({name, url}){
  //items of navigation bar

    return (<div>
      <li className="nav-item navigation-link">
    <a className="nav-link navigation-link" href={'/api'+url}>{name}</a><br />
    </li>
    </div>)
}

export default NavItem;