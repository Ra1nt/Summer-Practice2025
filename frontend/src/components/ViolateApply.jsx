import React, { useState, useEffect, useCallback } from 'react';

const ViolateApply = () => {
  const [violateInfo, setViolateInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [processing, setProcessing] = useState(null); // Track which item is being processed

  const fetchViolateInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/violateApply/getViolateInfo?pageNum=1&pageSize=10');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.code === 200 && result.data) {
        setViolateInfo(result.data.list || []);
      } else if (result.code !== 200) {
        throw new Error(result.msg || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchViolateInfo();
  }, [fetchViolateInfo]);

  const handleApplyAdded = () => {
    setShowAddForm(false);
    fetchViolateInfo(); // Refresh the list
  };

  const handlePass = async (id) => {
    setProcessing(id);
    try {
      const response = await fetch('/api/violateApply/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, username: 'test_user' }), // Assuming 'test_user' for now
      });
      const result = await response.json();
      if (result.code === 200) {
        fetchViolateInfo();
      } else {
        alert('Operation failed: ' + result.msg);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRecoverPass = async (violateId) => {
    setProcessing(violateId);
    try {
      const response = await fetch('/api/recoverApply/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ violateId: violateId, username: 'test_user' }),
      });
      const result = await response.json();
      if (result.code === 200) {
        fetchViolateInfo();
      } else {
        alert('操作失败: ' + result.msg);
      }
    } catch (error) {
      alert('发生错误: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRecoverRefuse = async (violateId) => {
    setProcessing(violateId);
    try {
      const response = await fetch('/api/recoverApply/refuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ violateId: violateId, username: 'test_user' }),
      });
      const result = await response.json();
      if (result.code === 200) {
        fetchViolateInfo();
      } else {
        alert('操作失败: ' + result.msg);
      }
    } catch (error) {
      alert('发生错误: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRefuse = async (id) => {
    setProcessing(id);
    try {
      const response = await fetch('/api/violateApply/refuse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, username: 'test_user' }), // Assuming 'test_user' for now
      });
      const result = await response.json();
      if (result.code === 200) {
        fetchViolateInfo();
      } else {
        alert('Operation failed: ' + result.msg);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const statusMap = {
    0: '已恢复',
    1: '待审核',
    2: '已通过',
    3: '恢复审核中',
    4: '已拒绝',
  };

  if (loading) return <p className="loading">加载中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>违规申请信息</h3>
        <button onClick={() => setShowAddForm(true)} className="btn">新增违规申请</button>
      </div>

      {showAddForm && (
        <AddViolateApplyForm
          onApplyAdded={handleApplyAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>申请ID</th>
            <th>客户名称</th>
            <th>违规原因</th>
            <th>违规等级</th>
            <th>申请人</th>
            <th>申请日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {violateInfo.map(info => (
            <tr key={info.violate_id}>
              <td>{info.violate_id}</td>
              <td>{info.customer_name}</td>
              <td>{info.violate_reason}</td>
              <td>{info.violate_level}</td>
              <td>{info.apply_person}</td>
              <td>{info.apply_date}</td>
              <td>{statusMap[info.violate_status] || '未知'}</td>
              <td>
                {info.violate_status === 1 && (
                  <>
                    <button 
                      onClick={() => handlePass(info.violate_id)} 
                      disabled={processing === info.violate_id}
                    >
                      {processing === info.violate_id ? '处理中...' : '通过'}
                    </button>
                    <button 
                      onClick={() => handleRefuse(info.violate_id)} 
                      disabled={processing === info.violate_id}
                      style={{ marginLeft: '5px' }}
                    >
                      {processing === info.violate_id ? '处理中...' : '拒绝'}
                    </button>
                  </>
                )}
                {info.violate_status === 3 && (
                  <>
                    <button 
                      onClick={() => handleRecoverPass(info.violate_id)} 
                      disabled={processing === info.violate_id}
                    >
                      {processing === info.violate_id ? '处理中...' : '通过恢复'}
                    </button>
                    <button 
                      onClick={() => handleRecoverRefuse(info.violate_id)} 
                      disabled={processing === info.violate_id}
                      style={{ marginLeft: '5px' }}
                    >
                      {processing === info.violate_id ? '处理中...' : '拒绝恢复'}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddViolateApplyForm = ({ onApplyAdded, onCancel }) => {
  const [customerId, setCustomerId] = useState('');
  const [violateReason, setViolateReason] = useState('');
  const [remark, setRemark] = useState('');
  const [username, setUsername] = useState('test_user'); // This should be dynamic in a real app

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/violateApply/insertApply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: parseInt(customerId),
          violateReason,
          remark,
          username,
        }),
      });
      const result = await response.json();
      if (result.code === 200) {
        onApplyAdded();
      } else {
        alert('Failed to add application: ' + result.msg);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="add-form" style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h4>新增违规申请</h4>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>客户ID: </label>
          <input type="number" value={customerId} onChange={e => setCustomerId(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>违规原因 (逗号分隔): </label>
          <input type="text" value={violateReason} onChange={e => setViolateReason(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>备注: </label>
          <textarea value={remark} onChange={e => setRemark(e.target.value)} />
        </div>
        <button type="submit" className="btn">提交</button>
        <button type="button" onClick={onCancel} className="btn" style={{ marginLeft: '10px' }}>取消</button>
      </form>
    </div>
  );
};

export default ViolateApply;

