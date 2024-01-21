import React from "react";
import { useParams } from "react-router-dom";
import Postlist from "./post/Postlist";

function Home({ auth })
{
  //viewing posts
  var { page } = useParams();


  if (typeof page === "undefined" || page < 1) {
    page = 0;
  } else {
    page = parseInt(page, 10); 
  }

  return (
    <div className="container mt-4">
      <div><Postlist page={page} auth={auth} /></div>
    </div>
  );
}

export default Home;
