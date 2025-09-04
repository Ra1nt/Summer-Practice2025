import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false); // 切换登录/注册
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 新增确认密码
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 登录逻辑
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(
        `/api/admin/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&authority=0`,
        { method: 'POST' }
      );

      if (!response.ok) throw new Error('Login request failed');

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
  };

  // 注册逻辑
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 检查两次密码是否一致
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: 'GET' }
      );

      if (!response.ok) throw new Error('Register request failed');

      const result = await response.json();

      if (result.code === 200) {
        alert('注册成功，请登录');
        setIsRegister(false); // 注册成功后跳回登录页面
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.msg || 'Register failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>DC管理系统</h2>
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
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

          {isRegister && (
            <div className="form-group">
              <label>确认密码:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn">
            {isRegister ? '注册' : '登录'}
          </button>
        </form>

        <p style={{ marginTop: '10px' }}>
          {isRegister ? (
            <>
              已有账号？{' '}
              <button onClick={() => setIsRegister(false)} className="link-btn">
                去登录
              </button>
            </>
          ) : (
            <>
              还没有账号？{' '}
              <button onClick={() => setIsRegister(true)} className="link-btn">
                去注册
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
