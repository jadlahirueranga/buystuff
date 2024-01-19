import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Messagehistory() {
  //Displays a list of users messaged with
  const apiUrl = window.__API_PROXY__;
  const messageUrl = `${apiUrl}/message`;

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const viewMessages = async () => {
    try {
      const response = await fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);

        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
        }

        throw new Error('Remove failed');
      }

      const data = await response.json();
      console.log(data);
      setUsers(data.profiles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    viewMessages();
  }, []);

  return (
    <div className="container mt-4 ">

      <ul className="list-group bg-custom offset">
     
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            
            <li key={user._id} className="d-flex align-items-center custom-list-item">
            <br /><br /> &nbsp;<img src={user.picture} className="profile-picture mr-3 bg-custom2" alt={`${user.name}'s profile`} style={{ width: '50px', height: '50px' }} />
              <div className="">
                <p className="mb-1"> &nbsp;Messages from {user.name}</p>
                &nbsp;&nbsp;<a href={messageUrl + `/${user._id}`} className="title-link user-link">
                View Messages
                </a>
              </div>
              <br />
            </li>
          ))
        ) : (
          <p>No Messages</p>
        )}
      </ul> </div>

  );
  
  
}

export default Messagehistory;
