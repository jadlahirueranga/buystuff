import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Post()
//Post an ad
{
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("Ampara");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  const [color, setColor] = useState("Red");
  const [type, setType] = useState("");

  const [error, setError] = useState("");

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = (e) =>
  {
    const newImages = [...e.target.files];
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleUpload = async () =>
  {
    try {
      setLoading(true);

      const imageUrls = await Promise.all(
        images.map(async (image) =>
        {
          const formData = new FormData();
          formData.append("image", image);

          const response = await axios.post(
            "https://api.imgbb.com/1/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              params: {
                key: "1ad0dd967a53fdbc085cef85b993a32c",
              },
            }
          );

          return response.data.data.url;
        })
      );

      setUrls(imageUrls);
      console.log("Images uploaded successfully. Image URLs:", imageUrls, images);
    } catch (error) {
      console.error("Error uploading images:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () =>
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
          district: district,
          city: city,
          price: price,
          images: urls,
          type: type,
          color: color,
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
    <div className="container offset bg-custom">
      <h2 className="mb-4">Post your Advertisement</h2>
      <form  onSubmit={handlePost}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="colors">Choose the color of your item:</label>
          <select
            name="colors"
            id="colors"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
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

        <div className="form-group">
          <label htmlFor="districts">Choose your district:</label>
          <select
            name="districts"
            id="districts"
            className="form-control"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
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
          <input
            type="text"
            className="form-control"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            className="form-control"
            placeholder="Price of your item (in Sri Lanken Rupees)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {Array.isArray(urls) && urls.length > 0 ? (
          urls.map((url, index) => <img key={index} src={url} alt={`image_${index}`} className="img-thumbnail" />)
        ) : (
          <p>No images available</p>
        )}

        <div className="form-group">
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="form-control-file" />
          <button onClick={handleUpload} disabled={loading} className="btn btn-primary mt-2">
            Upload Images
          </button>
        </div>

        <div className="form-group">
          <textarea
            rows="4"
            cols="50"
            placeholder="Item Description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="300"
            required
          />
        </div>

        <div className="form-group">
          <button disabled={loading} type="submit" className="btn btn-success">
            Post
          </button>
        </div>
        <div className="text-danger">{error}</div>
      </form>
    </div>
  );
}

export default Post;
