import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // 需要新建 CSS 文件

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
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
        setIsRegister(false);
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
    <div className="login-page">
      <div className="login-left">
        <div className="brand">
          <h1>DC管理系统</h1>
          <p>企业级客户管理平台</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>{isRegister ? '注册账号' : '登录账号'}</h2>
          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isRegister && (
              <div className="form-group">
                <input
                  type="password"
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary">
              {isRegister ? '注册' : '登录'}
            </button>
          </form>

          <div className="switch">
            {isRegister ? (
              <span>
                已有账号？{' '}
                <button className="link-btn" onClick={() => setIsRegister(false)}>
                  去登录
                </button>
              </span>
            ) : (
              <span>
                还没有账号？{' '}
                <button className="link-btn" onClick={() => setIsRegister(true)}>
                  去注册
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
