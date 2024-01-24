import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import Comment from "../Comment";

function ForumViewPost() {
  const [post, setPost] = useState({});

  const { postId } = useParams();

  function formatDate(timestamp)
  {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };

      const date = typeof timestamp === 'string' ? new Date(parseInt(timestamp, 10)) : new Date(timestamp);

      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error.message);
      return 'Invalid Date';
    }
  }

  const handlePosts = useCallback(async () => {
    try {
      const response = await fetch('/getpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
      });

      if (!response.ok) {
        console.log("Post couldn't be retrieved");
        // Handle non-successful response (e.g., server error)
      }

      const data = await response.json();
      console.log(data);
      setPost(data.post);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }, [postId]);


  useEffect(() => {
    handlePosts();
  }, [postId, handlePosts]);

  return (
    <div className="container mt-5">
      {Object.keys(post).length > 0 && (
        <div className="card offset">
          <div className="card-body bg-custom5">
            <h5 className="card-title"><a className="title-link" href={post.postUrl}>{post.title}</a> </h5> <sup className="card-text">{formatDate(post.date)}</sup> 
            <p className="card-text">{post.description}</p>
         


           
            <Comment refresh={handlePosts} post={post} text="Reply"  />
          </div>
        </div>
      )}
    </div>
  );
}

export default ForumViewPost;
