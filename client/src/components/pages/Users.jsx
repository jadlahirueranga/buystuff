import React, { useEffect, useState } from "react";
import UserTemplate from "./UserTemplate";
import { redirect } from "react-router-dom";

function Users() {
  //displays a list of users
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const getUsers = async () => {
    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: search }),
      });

      if (!response.ok) {
        console.log("Users couldn't be retrieved");
        return redirect("/dashboard");
      }

      const data = await response.json();
      setUsers(data.filteredArray);
    } catch (error) {
      console.error(error);
      return redirect("/dashboard");
    }
  };

  useEffect(() => {
    getUsers();
  }, [search]);

  return (
    <div className="users-container">
      <form className="search-form">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for Users"
          className="form-control"
          required
        />
        <button type="button" className="btn btn-primary" onClick={getUsers}>
          Search
        </button>
      </form>

      <div className="user-list">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <UserTemplate key={user.email} name={user.name} image={user.picture} email={user.email} phone={user.phone} password={user.password} />
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default Users;
