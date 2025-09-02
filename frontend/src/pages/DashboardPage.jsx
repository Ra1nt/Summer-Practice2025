import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import CustomerInfo from '../components/CustomerInfo';
import ViolateInfo from '../components/ViolateInfo';
import ViolateCustomerInfo from '../components/ViolateCustomerInfo';
import ViolateApply from '../components/ViolateApply';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Basic authentication check
  if (!localStorage.getItem('isAuthenticated')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>菜单</h2>
        <nav>
          <ul>
            <li><Link to="customer-info">客户信息</Link></li>
            <li><Link to="violate-info">违规信息</Link></li>
            <li><Link to="violate-customer-info">违规客户信息</Link></li>
            <li><Link to="violate-apply">违规申请</Link></li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>退出登录</button>
      </div>
      <div className="content">
        <Routes>
          <Route path="customer-info" element={<CustomerInfo />} />
          <Route path="violate-info" element={<ViolateInfo />} />
          <Route path="violate-customer-info" element={<ViolateCustomerInfo />} />
          <Route path="violate-apply" element={<ViolateApply />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;

