import React, { useState, useEffect } from 'react';

const ViolateInfo = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecoverForm, setShowRecoverForm] = useState(null); // Holds the violation to recover
  const [recoverReason, setRecoverReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await fetch('/api/violateApply/getViolateInfo?pageNum=1&pageSize=10');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.code === 200) {
          setViolations(result.data.list || []);
        } else {
          throw new Error(result.msg || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  if (loading) return <p className="loading">加载中...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    if (!showRecoverForm) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/recoverApply/insertApply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: showRecoverForm.customer_id,
          violateId: showRecoverForm.violate_id,
          recoverReason,
          username: 'test_user', // This should be dynamic in a real app
        }),
      });
      const result = await response.json();
      if (result.code === 200) {
        alert('恢复申请已提交！');
        setShowRecoverForm(null);
        setRecoverReason('');
        // You would typically re-fetch data here, for now, we can reload
        window.location.reload();
      } else {
        alert('申请失败: ' + result.msg);
      }
    } catch (error) {
      alert('发生错误: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return '已恢复';
      case 1:
        return '待审核';
      case 2:
        return '已通过';
      case 3:
        return '恢复审核中';
      case 4:
        return '已拒绝';
      default:
        return '未知';
    }
  };

  return (
    <div>
      <h3>违规信息</h3>

      {showRecoverForm && (
        <div className="add-form" style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
          <h4>为 {showRecoverForm.customer_name} 提交恢复申请</h4>
          <form onSubmit={handleRecoverSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>恢复原因: </label>
              <textarea 
                value={recoverReason} 
                onChange={e => setRecoverReason(e.target.value)} 
                required 
                style={{ width: '100%', minHeight: '80px' }}
              />
            </div>
            <button type="submit" className="btn" disabled={processing}>
              {processing ? '提交中...' : '提交申请'}
            </button>
            <button type="button" onClick={() => setShowRecoverForm(null)} className="btn" style={{ marginLeft: '10px' }}>
              取消
            </button>
          </form>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>客户名称</th>
            <th>违规原因</th>
            <th>违规等级</th>
            <th>状态</th>
            <th>申请人</th>
            <th>申请日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {violations.map(violation => (
            <tr key={violation.violate_id}>
              <td>{violation.violate_id}</td>
              <td>{violation.customer_name}</td>
              <td>{violation.violate_reason}</td>
              <td>{violation.violate_level}</td>
              <td>{getStatusText(violation.violate_status)}</td>
              <td>{violation.apply_person}</td>
              <td>{violation.apply_date}</td>
              <td>
                {violation.violate_status === 2 && (
                  <button onClick={() => setShowRecoverForm(violation)} className="btn">
                    恢复申请
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViolateInfo;

