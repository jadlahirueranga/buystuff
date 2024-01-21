import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess, errorMessage })
{
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () =>
  {
    try {
      setLoading(true);

      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResponse(data);
      setLoading(false);


      if (response.message === "Login successful") {
        onLoginSuccess();
        navigate("/home", { replace: true });
        console.log("fa");
      }

      console.log(data);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError('Login failed (tip: make sure you typed the correct email and password)');
    }
  };
  useEffect(() =>
  {
    onLoginSuccess();
  }, [response.message, onLoginSuccess]);
  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <div className="card ">
          <div className="card-body bg-custom6">
            <h2 className="card-title">Login</h2>
            <form>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-danger">{errorMessage}</div>
              <div className="text-success">{response.message}{error}</div>
              <button
                disabled={loading}
                type="button"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
