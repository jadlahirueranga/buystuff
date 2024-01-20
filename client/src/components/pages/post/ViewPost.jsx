import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import Comment from "../Comment";

function ViewPost() {
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

  const handlePosts = async () => {
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
  };

  useEffect(() => {
    handlePosts();
  }, [postId]);

  return (
    <div className="container mt-5">
      {Object.keys(post).length > 0 && (
        <div className="card offset">
          <div className="card-body bg-custom">
            <h5 className="card-title"><a href={post.postUrl}>{post.title}</a></h5>
            <p className="card-text"><b>Description:</b><br />{post.description}</p>
            <p className="card-text"><b>Date:</b><br />{formatDate(post.date)}</p>
            <p className="card-text"><b>District:</b><br />{post.district}</p>
            <p className="card-text"><b>City:</b><br />{post.city}</p>
            <p className="card-text"><b>Price:</b><br />Rs.{post.price}/=</p>
            <p className="card-text"><b>Color:</b><br />{post.color}</p>
            <p className="card-text"><b>Type:</b><br />{post.type}</p>

            <div className="card-text"><b>Images:</b></div>
            {Array.isArray(post.images) && post.images.length > 0 ? (
              <div className="card-images">
                {post.images.map((image, index) => (
                  <div>
                  <br/>
                  <img key={index} className="img-fluid expandable-image" src={image} alt={`image_${index}`} />
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}
            <hr />
            <Comment refresh={handlePosts} post={post} text="Comment" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPost;
