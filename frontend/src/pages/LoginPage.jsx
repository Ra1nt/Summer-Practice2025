import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    // Temporary login using the /test API
    try {
      const response = await fetch('/api/admin/test', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Login request failed');
      }

      const result = await response.json();

      if (result.code === 200) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError(result.msg || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    /*
    // Original login logic
    try {
      const response = await fetch(`/api/admin/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&authority=0`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Login request failed');
      }

      const result = await response.json();

      if (result.code === 200) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError(result.msg || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    */
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>DC管理系统</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>用户名:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>密码:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn">登录</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

