
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import Post from './components/pages/Post';
import Report from './components/pages/Report';
import Logout from './components/pages/Logout';
import Message from './components/pages/Message';
import AuthSwitcher from './components/pages/AuthSwitcher';
import MessageHistory from './components/pages/MessageHistory';
import User from './components/pages/User.jsx';
import ViewPost from './components/pages/post/ViewPost.jsx';
import Quiz from './components/pages/Quiz.jsx';
import Flowers from './components/pages/Flowers.jsx';
import About from './components/pages/About.jsx';
import ForumPost from './components/pages/ForumPost.jsx';
import ForumPostList from './components/pages/forumPost/ForumPostList.jsx';
import ForumViewPost from './components/pages/forumPost/ForumViewPost.jsx';


function App()
{
  const [auth, setAuth] = useState({});
  const navigate = useRouterNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState();

  const handleAuthStatus = async () =>
  {
    try {
      const response = await fetch("/auth");
      if (response.ok) {
        const data = await response.json();
        setAuth(data);
      }
    } catch (error) {
      console.error("Error fetching auth status:", error);
    }
  };



  useEffect(() =>
  {
    handleAuthStatus();
  }, []);

  useEffect(() =>
  {
    if (typeof auth.auth === "undefined") {
      setErrorMessage("Login Failed");
      return;
    }
    if (auth.auth !== true ) {
      // navigate('/home', { replace: true });
    } else if (typeof auth.user !== "undefined" && location.pathname === '/login') {
      navigate('/home', { replace: true });
    }
    else if (auth.auth !== true && location.pathname === '/') {
      navigate('/home', { replace: true });
    }
    else if (auth.user.isAdmin === false && location.pathname === '/register') {
      navigate('/home', { replace: true });
    } else if ((auth.user.isAdmin === false && auth.user.isMod === false) && (location.pathname === '/dashboard' || location.pathname === '/register')) {
      navigate('/home', { replace: true });
    } else if (location.pathname === '/login') {
      navigate('/home', { replace: true });
      setErrorMessage("Succsessfully Logged In");
    }
  }, [auth, navigate, location.pathname]);




  return (
    <div>
      {/* handling urls */}
      <Navbar auth={auth} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<AuthSwitcher onLoginSuccess={handleAuthStatus} />} />
        <Route path="/messagehistory" element={<MessageHistory />} />
        <Route path="/home/:page" element={<Home auth={auth} errorMessage={errorMessage} />} />
        <Route path="/home/" element={<Home auth={auth} />} />
        <Route path="/" element={<Home auth={auth} />} />
        <Route path="/post" element={<Post />} />
        <Route path="/dashboard" element={<Dashboard auth={auth} />} />
        <Route path="/report/:postId" element={<Report />} />
        <Route path="/message/:receiver" element={<Message auth={auth} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/user/:user" element={<User />} />
        <Route path="/post/:postId" element={<ViewPost />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flowers" element={<Flowers />} />
        <Route path="/about" element={<About />} />
        <Route path="/forumpost" element={<ForumPost />} />
        <Route path="/forumpostlist" element={<ForumPostList auth={auth} />} />
        <Route path="/viewforumpost/:postId" element={<ForumViewPost />} />

      </Routes>
    </div>
  );
}

export default App;
