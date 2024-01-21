import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, set_confirm_password] = useState('');
  const [admin, setAdmin] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [mod, setMod] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [auth, setAuth] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState('false');

  //Profile Picture
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
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

      // Saving the imageUrl in the database 
      console.log("Image uploaded successfully. Image URL:", imageUrl);
      setProfilePic(imageUrl);
      setLoading(false);

    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const checkData = () => {
    if (password === confirm_password) {
      setErrMessage("");
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
      setErrMessage("passwords don't match");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirm_password, admin, mod, profilePic, phone }),
      });

      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);

        // Check if the response is JSON
        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
        }

        throw new Error('Registration failed (tip: fill every required field with 3 to 300 characters, the password must be at least 8 characters)');
      }

      const data = await response.json();
      console.log(data);
      navigate("/home", { replace: true });

    } catch (error) {
      setErrMessage(error);
      console.error(error);
    }
  };

  useEffect(() => {
    checkData();
    fetch("/auth").then(
      response => response.json()
    ).then(
      data => {
        setAuth(data);
      }
    );
  }, [password, confirm_password, checkData]);

  return (
    <div className="container mt-5">
          <div className="col-md-6 offset-md-3 offset">
          <div className="card">
          <div className="card-body bg-custom6">
            <h2 className="card-title">Sign up</h2>
      <form> 
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkData();
            }}
            required
          />
    {errMessage && <div className="text-danger">{errMessage.toString()}</div>}

        </div>

        <div className="mb-3">
          <label htmlFor="confirm_password" className="form-label">Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            id="confirm_password"
            value={confirm_password}
            onChange={(e) => {
              set_confirm_password(e.target.value);
              checkData();
            }}
            required
          />
        {errMessage && <div className="text-danger">{errMessage.toString()}</div>}

        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone:</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {(auth.admin === true) ? (
          <div>
            <label className="form-label">Account type:</label>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="admin" name="type" value="admin" onChange={(e) => setAdmin(e.target.value)} />
              <label className="form-check-label" htmlFor="admin">Administrator</label>
            </div>
            <div className="form-check">
              <input type="radio" className="form-check-input" id="mod" name="type" value="mod" onChange={(e) => setMod(e.target.value)} />
              <label className="form-check-label" htmlFor="mod">Moderator</label>
            </div>
          </div>
        ) : (<p>Create your user account</p>)}

        <div className="mb-3">
          <img src={profilePic} className="profile_picture img-fluid" alt="Profile" />
          <input disabled={!loading} type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
        </div>

        <button disabled={!loading} type="button" className="btn btn-primary" onClick={handleUpload}>Upload Image</button>
        <br />
        <button disabled={confirm_password === "" ? true : !passwordsMatch} type="button" className="btn btn-success" onClick={handleRegister}>
          Register
        </button>
      </form>
      </div></div></div>
    </div>
  );
}

export default Register;
