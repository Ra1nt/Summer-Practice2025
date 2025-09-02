import React, { useState, useEffect, useCallback } from 'react';
import AddCustomerForm from './AddCustomerForm';

const CustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/customer/getCustomerInfo?pageNum=1&pageSize=10');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.code === 200) {
        setCustomers(result.data.list.map(item => item.customer) || []);
      } else {
        throw new Error(result.msg || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerAdded = () => {
    setShowAddForm(false);
    fetchCustomers(); // Refresh the customer list
  };

  if (loading) return <p className="loading">加载中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>客户信息</h3>
        <button onClick={() => setShowAddForm(true)} className="btn">添加新客户</button>
      </div>

      {showAddForm && (
        <AddCustomerForm 
          onCustomerAdded={handleCustomerAdded} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>客户名称</th>
            <th>地区</th>
            <th>行业</th>
            <th>外部等级</th>
            <th>状态</th>
            <th>违规次数</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id_}>
              <td>{customer.id_}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.area}</td>
              <td>{customer.industry}</td>
              <td>{customer.outside_level}</td>
              <td>{customer.status === 0 ? '正常' : '违规'}</td>
              <td>{customer.violate_num}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerInfo;
