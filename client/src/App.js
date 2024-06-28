
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
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
    //controling what pages to display depending on authentication and url
    if (typeof auth.auth === "undefined") {
      setErrorMessage("Login Failed");
      return;
    }
    if (auth.auth !== true ) {
      // navigate('/home', { replace: true });
    } else if (typeof auth.user !== "undefined" && location.pathname === '/api/login') {
      navigate('/api/home', { replace: true });
    }
    else if (auth.auth !== true && location.pathname === '/') {
      navigate('/api/home', { replace: true });
    }
    else if (auth.user.isAdmin === false && location.pathname === '/api/register') {
      navigate('/api/home', { replace: true });
    } else if ((auth.user.isAdmin === false && auth.user.isMod === false) && (location.pathname === '/api/dashboard' || location.pathname === '/api/register')) {
      navigate('/api/home', { replace: true });
    } else if (location.pathname === '/api/login') {
      navigate('/api/home', { replace: true });
      setErrorMessage("Succsessfully Logged In");
    }
  }, [auth, navigate, location.pathname]);




  return (
    <div>
      {/* handling urls */}
      <Navbar auth={auth} />
      <Routes>
        <Route path="/api/register" element={<Register />} />
        <Route path="/api/login" element={<AuthSwitcher onLoginSuccess={handleAuthStatus} />} />
        <Route path="/api/messagehistory" element={<MessageHistory />} />
        <Route path="/api/home/:page" element={<Home auth={auth} errorMessage={errorMessage} />} />
        <Route path="/api/home/" element={<Home auth={auth} />} />
        <Route path="/" element={<Home auth={auth} />} />
        <Route path="/api/post" element={<Post />} />
        <Route path="/api/dashboard" element={<Dashboard auth={auth} />} />
        <Route path="/api/report/:postId" element={<Report />} />
        <Route path="/api/message/:receiver" element={<Message auth={auth} />} />
        <Route path="/api/logout" element={<Logout />} />
        <Route path="/api/user/:user" element={<User />} />
        <Route path="/api/post/:postId" element={<ViewPost />} />
        <Route path="/api/quiz" element={<Quiz />} />
        <Route path="/api/flowers" element={<Flowers />} />
        <Route path="/api/about" element={<About />} />
        <Route path="/api/forumpost" element={<ForumPost />} />
        <Route path="/api/forumpostlist" element={<ForumPostList auth={auth} />} />
        <Route path="/api/viewforumpost/:postId" element={<ForumViewPost />} />

      </Routes>
    </div>
  );
}

export default App;
