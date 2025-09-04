import React, { useState, useEffect, useCallback } from 'react';
import AddCustomerForm from './AddCustomerForm';

const CustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 搜索关键字
  const [searchKeyword, setSearchKeyword] = useState('');
  const [queryKeyword, setQueryKeyword] = useState('');

  // 分页
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url;
      if (queryKeyword) {
        // 搜索接口，后端已支持分页
        url = `/api/customer/searchByName?name=${encodeURIComponent(queryKeyword)}&fuzzy=true&pageNum=${pageNum}&pageSize=${pageSize}`;
      } else {
        // 获取全部客户
        url = `/api/customer/getAllCustomers?pageNum=${pageNum}&pageSize=${pageSize}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('网络请求失败');

      const result = await response.json();
      console.log("请求地址:", url);
      console.log("返回数据:", result);

      if (result.code === 200) {
        // 后端返回 PageInfo 结构
        const data = result.data;
        setCustomers(data.list || []);
        setTotal(data.total || 0);
      } else {
        throw new Error(result.msg || '获取数据失败');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [queryKeyword, pageNum, pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerAdded = () => {
    setShowAddForm(false);
    setPageNum(1);
    setSearchKeyword('');
    setQueryKeyword('');
    fetchCustomers();
  };

  const handleSearch = () => {
    setPageNum(1);
    setQueryKeyword(searchKeyword.trim());
  };

  const handleReset = () => {
    setSearchKeyword('');
    setQueryKeyword('');
    setPageNum(1);
  };

  const totalPages = Math.ceil(total / pageSize);

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

      {/* 搜索框 */}
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="请输入客户名称"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch} style={{ marginLeft: "5px" }}>搜索</button>
        <button onClick={handleReset} style={{ marginLeft: "5px" }}>重置</button>
      </div>

      {/* 客户表格 */}
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

      {/* 分页 */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setPageNum(p => Math.max(1, p - 1))}
          disabled={pageNum === 1}
        >
          上一页
        </button>
        <span style={{ margin: "0 10px" }}>
          第 {pageNum} 页 / 共 {totalPages} 页
        </span>
        <button
          onClick={() => setPageNum(p => Math.min(totalPages, p + 1))}
          disabled={pageNum >= totalPages || totalPages === 0}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default CustomerInfo;
