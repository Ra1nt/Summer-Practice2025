/*
 * @Author: rain l0802_69@qq.com
 * @Date: 2025-09-03 14:30:32
 * @LastEditors: rain l0802_69@qq.com
 * @LastEditTime: 2025-09-05 09:52:50
 * @FilePath: /Summer-Practice2025/frontend/src/pages/DashboardPage.jsx
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import CustomerInfo from '../components/CustomerInfo';
import ViolateInfo from '../components/ViolateInfo';
import ViolateCustomerInfo from '../components/ViolateCustomerInfo';
import ViolateApply from '../components/ViolateApply';
import IndustryYearStats from '../components/IndustryYearStats';  
import AreaYearStats from '../components/AreaYearStats';          

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true); 

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!localStorage.getItem('isAuthenticated')) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        navigate('customer-info'); 
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, navigate]);

  return (
    <div className="dashboard" style={{ display: 'flex', height: '100vh' }}>
      {/* 菜单栏 */}
      <div 
        className="sidebar" 
        style={{ 
          width: '220px', 
          background: '#e0e0e0',   // 提高亮度
          color: '#333',           // 字体颜色加深
          padding: '20px',
          fontWeight: '500',
          fontSize: '16px'
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>菜单</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="customer-info" style={{ color: '#333', textDecoration: 'none' }}>客户信息</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="violate-info" style={{ color: '#333', textDecoration: 'none' }}>违规信息</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="violate-customer-info" style={{ color: '#333', textDecoration: 'none' }}>违规客户信息</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="violate-apply" style={{ color: '#333', textDecoration: 'none' }}>违规申请</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="industry-year-stats" style={{ color: '#333', textDecoration: 'none' }}>行业年度统计</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="area-year-stats" style={{ color: '#333', textDecoration: 'none' }}>地区年度统计</Link>
            </li>
          </ul>
        </nav>
        <button 
          className="logout-btn" 
          onClick={handleLogout} 
          style={{ 
            marginTop: '20px', 
            padding: '8px 15px', 
            cursor: 'pointer',
            backgroundColor: '#ff4d4f', 
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          退出登录
        </button>
      </div>

      {/* 内容区 */}
      <div className="content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
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
            <Route path="industry-year-stats" element={<IndustryYearStats />} /> 
            <Route path="area-year-stats" element={<AreaYearStats />} />         
            <Route path="*" element={<Navigate to="customer-info" />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
