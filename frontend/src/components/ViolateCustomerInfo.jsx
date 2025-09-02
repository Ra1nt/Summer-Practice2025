import React, { useState, useEffect, useCallback } from 'react';

const ViolateCustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchViolateCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/customer/getViolateCustomerInfo?pageNum=1&pageSize=10');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.code === 200) {
        setCustomers(result.data.list || []);
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
    fetchViolateCustomers();
  }, [fetchViolateCustomers]);

  if (loading) return <p className="loading">加载中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h3>违规客户信息</h3>
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

export default ViolateCustomerInfo;
