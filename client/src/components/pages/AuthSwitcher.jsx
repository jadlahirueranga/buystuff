import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthSwitcher = ({ onLoginSuccess }) => {
  //Switches between Login and Registration
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthType = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  return (
    <div className="text-center">
      <h2>{isLogin ? 'Login to Your Account' : 'Create A New Account'}</h2>
      <p>
        {isLogin
          ? 'Don’t have an account? Create one to access all features.'
          : 'Already have an account? Log in for a seamless experience.'}
      </p>
      <button className="btn btn-primary" onClick={toggleAuthType}>
        {isLogin ? 'Create Account' : 'Login'}
      </button>
      {isLogin ? <Login onLoginSuccess={onLoginSuccess} /> : <Register />}
    </div>
  );
};

export default AuthSwitcher;
