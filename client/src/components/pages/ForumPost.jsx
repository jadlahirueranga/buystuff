import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Post()
//Post an ad
{
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);


  const [error, setError] = useState("");


  const navigate = useNavigate();

 
  const handleForumPost = async () =>
  {
    try {
      const response = await fetch("/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          district: "district",
          city: "city",
          price: "1",
          images: "i",
          type: "i",
          color: "forumPost",
        }),
      });

      if (!response.ok) {
        throw new Error("Post failed (tip: Fill every field with 1-300 characters, maximum is 5 pictures per post)");
      }

      const data = await response.json();
      console.log(data);
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  useEffect(() => { }, [loading]);

  return (
    <div className="container mt-5 ">
      <form className="offset" onSubmit={handleForumPost}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title"
          />
        </div>

        <div className="form-group">
          <textarea
            rows="4"
            cols="50"
            className="form-control"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            maxLength="300"
            required
          />
        </div>

        <div className="form-group">
          <button disabled={loading} type="submit" className="btn btn-success">
            Submit
          </button>
        </div>
        <div className="text-danger">{error}</div>
      </form>
    </div>
  );
}

export default Post;
