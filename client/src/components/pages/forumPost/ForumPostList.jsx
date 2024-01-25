import React, { useCallback, useEffect, useState, useMemo } from "react";
import ForumPostTemplate from "./ForumPostTemplate";
import { Link } from "react-router-dom";

function ForumPostlist({ auth, page }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const maxPrice = 9999999999999999;
  const minPrice = 0;
  const city = '';
  const district = '';
  const color = 'forumPost';
  const type = '';
  const [status, setStatus] = useState('active');
  const [dataFromPost, setDataFromPost] = useState(0);

  const apiUrl = window.__API_PROXY__;
  const pageUrl = `${apiUrl}/api/home/`;
  const newPostUrl = `${apiUrl}/api/forumpost/`;
  const pageInt = parseInt(page, 10);

  if (isNaN(pageInt)) {
    console.error('Invalid page number:', page);
  }

  const pageUrls = useMemo(() => [
    pageUrl + (pageInt - 2),
    pageUrl + (pageInt - 1),
    pageUrl + pageInt,
    pageUrl + (pageInt + 1),
    pageUrl + (pageInt + 2),
  ], [pageUrl, pageInt]);

  const changeStatus = (e) => {
    if (e.target.checked === true) {
      setStatus('removed');
    } else {
      setStatus('active');
    }
  };

  const sendDataToList = (data) => {
    console.log('Data received from child:', data);
    setDataFromPost(data);
  };

  const handlePosts = useCallback(async () => {
    try {
      const response = await fetch('/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, search, maxPrice, minPrice, city, district, color, type, status }),
      });

      if (!response.ok) {
        console.log("Posts couldn't be retrieved" + pageUrls);
      }

      const data = await response.json();
      console.log(data);
      setPosts(data.filteredArray);
    } catch (error) {
      console.error(error);
    }
  }, [page, search, maxPrice, minPrice, city, district, color, type, status, pageUrls]);

  useEffect(() => {
    handlePosts();
  }, [dataFromPost, handlePosts]);
  return (
    <div className="container mt-5 ">
      <div className="row ">
        {/* Form Section */}
        <div className="col-md-12 mb-4 ">
          <div className="card offset" style={{ backgroundColor: 'transparent' }}>
            <div className="card-body text-center">
              <form>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    required
                  />
                </div>
                {auth.admin && (
                  <div className="form-check bright-text">
                    <input
                      type="checkbox"
                      className=""
                      id="showRemoved"
                      onChange={(e) => changeStatus(e)}
                    />&nbsp;
                    <label className="form-check-labe" htmlFor="showRemoved">
                      Browse removed support requests
                    </label>
                  </div>
                )}

                <button type="button" className="btn btn-primary" onClick={handlePosts}>
                  Search
                </button>&nbsp;
                <Link to={newPostUrl} className="btn btn-success mt-2">
                  Make a Post
                </Link>
              </form>
            </div>
          </div>
        </div>
        {/* Posts */}
        <div className="col-md-12">
          <div className="row">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="col-md-12 mb-4">
                  <ForumPostTemplate
                    auth={auth}
                    name={post.posterName}
                    status={post.status}
                    user={post.poster}
                    id={post._id}
                    type={post.type}
                    color={post.color}
                    images={post.images}
                    price={post.price}
                    description={post.description}
                    title={post.title}
                    district={post.district}
                    date={post.date}
                    city={post.city}
                    dataFromPost={sendDataToList}
                  />
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumPostlist;
