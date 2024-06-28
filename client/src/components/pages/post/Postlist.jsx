import React, { useEffect, useState, useMemo, useCallback } from "react";
import Posttemplate from "./PostTemplate";


function Postlist({ auth, page })
//The list of posts
{
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minPrice, setMinPrice] = useState(0);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('active');
  const [dataFromPost, setDataFromPost] = useState(0);


//uused pagesplittting
  const apiUrl = window.__API_PROXY__;
  const pageUrl = `${apiUrl}/api/home/`;
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

  const changeStatus = (e) =>
      //remove a post or readd one as an admin
  {
    if (e.target.checked === true) {
      setStatus('removed');
    } else {
      setStatus('active');
    }
  };

  const sendDataToList = (data) =>
    //Gaining data from postTemplate(child)
  {
    console.log('Data received from child:', data);
    setDataFromPost(data);
  };

  const handlePosts = useCallback(async () =>
  {
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
  },[page, search, maxPrice, minPrice, city, district, color, type, status, pageUrls]);

  useEffect(() =>
  {
    handlePosts();

  }, [dataFromPost, handlePosts]);

  return (
    <div className="container mt-5 ">
      <div className="row flex-wrap ">
        {/* Filters */}

        <div className="col-md-3 fixedmovement">
          <div className="card">
            <div className="card-body bg-custom2 ">
              <h5 className="card-title">Filters</h5>
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name or Description"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    placeholder="Item Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="range"
                    className="form-range"
                    id="minPrice"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value))}
                    min={0}
                    max={1500000}
                  />
                  <span>Minimum cost of the item is Rs.{minPrice}/=</span>
                </div>

                <div className="form-group">
                  <input
                    type="range"
                    className="form-range"
                    id="maxPrice"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    min={0}
                    max={1500000}
                  />
                  <span>Maximum cost of the item is Rs.{maxPrice}/=</span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <select
                    className="form-control"
                    id="districts"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">Select a District</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Galle">Galle</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Kegalla">Kegalla</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Mannar">Mannar</option>
                    <option value="Matale">Matale</option>
                    <option value="Matara">Matara</option>
                    <option value="Moneragala">Moneragala</option>
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Puttalam">Puttalam</option>
                    <option value="Ratnapura">Ratnapura</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Vavuniya">Vavuniya</option>
                  </select>
                </div>

                <div className="form-group">
                  <select
                    className="form-control"
                    id="colors"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <option value="">Select a Color</option>
                    <option value="Red">Red</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Purple">Purple</option>
                    <option value="Orange">Orange</option>
                    <option value="Pink">Pink</option>
                    <option value="Teal">Teal</option>
                    <option value="Cyan">Cyan</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Grey">Grey</option>
                    <option value="Lime">Lime</option>
                    <option value="Brown">Brown</option>
                    <option value="Maroon">Maroon</option>
                    <option value="Magenta">Magenta</option>
                    <option value="Amber">Amber</option>
                  </select>
                </div>

                {auth.admin && (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showRemoved"
                      onChange={(e) => changeStatus(e)}
                    />
                    <label className="form-check-label" htmlFor="showRemoved">
                      Show removed posts
                    </label>
                  </div>
                )}

                <button type="button" className="btn btn-primary" onClick={handlePosts}>
                  Filter
                </button>
              </form>

            </div>
          </div>
        </div>
        {/* Posts */}
        <div className="posttemplate col-md-9 ">
          <div className="row ">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="col-md-12 mb-4">

                  <Posttemplate
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

export default Postlist;