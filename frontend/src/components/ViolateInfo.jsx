import React, { useState, useEffect } from 'react';

const ViolateInfo = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecoverForm, setShowRecoverForm] = useState(null);
  const [recoverReason, setRecoverReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const recoverOptions = [
    '正常结算后解除',
    '在其他金融机构违约解除，或外部评级显示为非违约级别',
    '计提比例小于设置界限',
    '连续 12 个月内按时支付本金和利息',
    '客户的还款意愿和还款能力明显好转，已偿付各项逾期本金、逾期利息和其他费用（包括罚息等），且连续 12 个月内按时支付本金、利息',
    '导致违约的关联集团内其他发生违约的客户已经违约重生，解除关联成员的违约设定'
  ];

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await fetch('/api/violateApply/getViolateInfo?pageNum=1&pageSize=10');
        if (!response.ok) throw new Error('Network response was not ok');
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

  const getStatusText = (status) => {
    switch (status) {
      case 0: return '已恢复';
      case 1: return '待审核';
      case 2: return '已通过';
      case 3: return '重生审核中';
      case 4: return '已拒绝';
      default: return '未知';
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    if (!showRecoverForm || !recoverReason) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/recoverApply/insertApply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: showRecoverForm.customer_id,
          violateId: showRecoverForm.violate_id,
          recoverReason,
          username: 'test_user',
        }),
      });
      const result = await response.json();
      if (result.code === 200) {
        alert('违约重生申请已提交！');
        setShowRecoverForm(null);
        setRecoverReason('');
        window.location.reload();
      } else {
        alert('申请失败: ' + result.msg);
      }
    } catch (err) {
      alert('发生错误: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenForm = (v) => {
    setShowRecoverForm(v);
    setRecoverReason('');
  };

  return (
    <div>
      <h3>违约信息</h3>

      {showRecoverForm && (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
          <h4>为 {showRecoverForm.customer_name} 提交违约重生申请</h4>

          <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <p><strong>认定违约原因:</strong> {showRecoverForm.violate_reason}</p>
            <p><strong>严重程度:</strong> {showRecoverForm.violate_level}</p>
            <p><strong>认定人:</strong> {showRecoverForm.apply_person}</p>
            <p><strong>认定申请时间:</strong> {showRecoverForm.apply_date}</p>
            <p><strong>最新外部等级:</strong> {showRecoverForm.latest_external_rating || '-'}</p>
          </div>

          {/* 重生原因下拉框 */}
          <div style={{ marginBottom: '10px' }}>
            <label>重生原因: </label>
            <select
              value={recoverReason}
              onChange={(e) => setRecoverReason(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="">请选择重生原因</option>
              {recoverOptions.map((reason, idx) => (
                <option key={idx} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {/* 提交和取消按钮水平排列 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn" onClick={handleRecoverSubmit} disabled={processing}>
              {processing ? '提交中...' : '提交申请'}
            </button>
            <button type="button" onClick={() => setShowRecoverForm(null)} className="btn">
              取消
            </button>
          </div>
        </div>
      )}

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>违约客户</th>
            <th>审核状态</th>
            <th>认定违约原因</th>
            <th>严重程度</th>
            <th>认定人</th>
            <th>认定申请时间</th>
            <th>认定审核时间</th>
            <th>最新外部等级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {violations.map(v => (
            <tr key={v.violate_id}>
              <td>{v.customer_name}</td>
              <td>{getStatusText(v.violate_status)}</td>
              <td>{v.violate_reason}</td>
              <td>{v.violate_level}</td>
              <td>{v.apply_person}</td>
              <td>{v.apply_date}</td>
              <td>{v.audit_date || '-'}</td>
              <td>{v.latest_external_rating || '-'}</td>
              <td>
                {v.violate_status === 2 && (
                  <button onClick={() => handleOpenForm(v)} className="btn">
                    违约重生
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
