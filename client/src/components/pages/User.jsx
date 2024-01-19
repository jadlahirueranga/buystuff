import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './Message.css'; // Import the CSS file for styling

function Message()
{
  const { user } = useParams();
  const [userData, setUserData] = useState({});
  const [askedUser, setAskedUser] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [activeForm, setActiveForm] = useState("password"); // Default to the password form
  const navigate = useNavigate();

  const handleFileChange = (e) =>
  {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () =>
  {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);

      // Upload image to ImgBB
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

      // Get the image URL from the response
      const imageUrl = response.data.data.url;

      // Save the imageUrl in your database or perform other actions
      console.log("Image uploaded successfully. Image URL:", imageUrl);
      setProfilePic(imageUrl);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const getUser = async () =>
  {
    try {
      setLoading(true);
      const response = await fetch("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user }),
      });

      if (!response.ok) {
        console.log("Couldn't retrieve data");
        setLoading(false);
        throw new Error("Failed to find the user");
      }

      const data = await response.json();
      setUserData(data.thisUser);
      setAskedUser(data.askedUser);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.error(error);
      setErr(error.message);
      setLoading(false);
    }
  };

  const changeSetting = async (oldPassword, newValue, setting) =>
  {
    try {
      const response = await fetch("/changesetting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          setting: setting,
          newValue: newValue,
          checker: oldPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setLoading(false);
        setErr(data.message);
      }

      const data = await response.json();
      setErr(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() =>
  {
    getUser();
  }, []);

  return (
    <div className="message-container">
      <h2>{userData.name}</h2>

      { (
        <div className="bg-custom6 text-center">
          <div>
            <table className="user-profile-table">
              <tbody>
                <tr>
                  <td><strong>Username:</strong></td>
                  <td>{userData.username}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{userData.email}</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>{userData.phone}</td>
                </tr>
                <tr>
                  <td><strong>Profile Picture:</strong></td>
                  <td><img src={userData.picture} className="profile_picture" alt="Profile" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          {(userData._id === askedUser._id )&&(
          <div>&nbsp;
            <button className="btn btn-success" onClick={() => setActiveForm("password")}>Change Password</button>&nbsp;
            <button className="btn btn-success" onClick={() => setActiveForm("phone")}>Change Phone Number</button>&nbsp;
            <button className="btn btn-success" onClick={() => setActiveForm("picture")}>Change Profile Picture</button>&nbsp;

            {activeForm === "password" && (
              <div className="form-container">
                <form>
                  <h3>Change Password</h3>
                  <div className="form-group">
                    <label>Old Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  {err && <div className="text-danger">{err}</div>}
                  <button
                    disabled={loading}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => changeSetting(oldPassword, newPassword, "password")}
                  >
                    {loading ? 'Saving...' : 'Save Password'}
                  </button>
                </form>
              </div>
            )}

            {activeForm === "phone" && (
              <div className="form-container">
                <form>
                  <h3>Change Phone Number</h3>
                  <div className="form-group">
                    <label>New Phone Number:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  {(err.length > 0) && <div className="text-danger">{err}</div>}
                  <button
                    disabled={loading}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => changeSetting(oldPassword, phone, "phone")}
                  >
                    {loading ? 'Saving...' : 'Save Phone Number'}
                  </button>
                </form>
              </div>
            )}


            {activeForm === "picture" && (
              <div className="form-container">
                <form>
                  <h3>Change Profile Picture</h3>
                  <div className="form-group">
                    <img src={profilePic} className="profile-picture" alt="Profile" />
                    <input type="file" accept="image/*" className="" onChange={handleFileChange} />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleUpload}>
                    Upload Image
                  </button>&nbsp;
                  {err && <div className="text-danger ">{err}</div>}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => changeSetting(oldPassword, profilePic, "picture")}
                    className="btn btn-primary"
                  >
                    Use this picture
                  </button>
                </form>
              </div>
            )}

          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Message;
