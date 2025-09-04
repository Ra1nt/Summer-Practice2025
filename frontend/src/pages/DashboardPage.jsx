/*
 * @Author: rain l0802_69@qq.com
 * @Date: 2025-09-03 14:30:32
 * @LastEditors: rain l0802_69@qq.com
 * @LastEditTime: 2025-09-04 10:06:03
 * @FilePath: /Summer-Practice2025/frontend/src/pages/DashboardPage.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import CustomerInfo from '../components/CustomerInfo';
import ViolateInfo from '../components/ViolateInfo';
import ViolateCustomerInfo from '../components/ViolateCustomerInfo';
import ViolateApply from '../components/ViolateApply';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true); // 控制欢迎界面

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Basic authentication check
  if (!localStorage.getItem('isAuthenticated')) {
    return <Navigate to="/login" />;
  }

  // 欢迎界面定时跳转到客户信息
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        navigate('customer-info'); // 跳转到客户信息
      }, 1500); // 1.5秒后跳转
      return () => clearTimeout(timer);
    }
  }, [showWelcome, navigate]);

  return (
    <div className="dashboard" style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar" style={{ width: '200px', background: '#f0f0f0', padding: '20px' }}>
        <h2>菜单</h2>
        <nav>
          <ul>
            <li><Link to="customer-info">客户信息</Link></li>
            <li><Link to="violate-info">违规信息</Link></li>
            <li><Link to="violate-customer-info">违规客户信息</Link></li>
            <li><Link to="violate-apply">违规申请</Link></li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout} style={{ marginTop: '20px' }}>退出登录</button>
      </div>

      <div className="content" style={{ flex: 1, padding: '20px' }}>
        {showWelcome ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>欢迎来到 DC 管理系统</h1>
            <p>即将为您加载客户信息...</p>
          </div>
        ) : (
          <Routes>
            <Route path="customer-info" element={<CustomerInfo />} />
            <Route path="violate-info" element={<ViolateInfo />} />
            <Route path="violate-customer-info" element={<ViolateCustomerInfo />} />
            <Route path="violate-apply" element={<ViolateApply />} />
            {/* 默认路由：重定向到客户信息 */}
            <Route path="*" element={<Navigate to="customer-info" />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
