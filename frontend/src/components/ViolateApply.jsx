import React, { useState, useEffect, useCallback } from 'react';

const levelOptions = [
  { label: '低', value: 1 },
  { label: '中', value: 2 },
  { label: '高', value: 3 },
];

const levelMap = {
  1: '低',
  2: '中',
  3: '高',
};

const statusMap = {
  0: '已恢复',
  1: '待审核',
  2: '已通过',
  3: '恢复审核中',
  4: '已拒绝',
};

const ViolateApply = () => {
  const [violateInfo, setViolateInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [processing, setProcessing] = useState(null);

  const fetchViolateInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/violateApply/getViolateInfo?pageNum=1&pageSize=10');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      if (result.code === 200 && result.data) {
        setViolateInfo(result.data.list || []);
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
    fetchViolateInfo();
  }, [fetchViolateInfo]);

  const handleApplyAdded = () => {
    setShowAddForm(false);
    fetchViolateInfo();
  };

  const handleAction = async (url, payload, id) => {
    setProcessing(id);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.code === 200) fetchViolateInfo();
      else alert('操作失败: ' + result.msg);
    } catch (err) {
      alert('发生错误: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <p className="loading">加载中...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>违规申请信息</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn"
          style={{ padding: '5px 15px' }}
        >
          新增违规申请
        </button>
      </div>

      {showAddForm && (
        <AddViolateApplyForm
          onApplyAdded={handleApplyAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
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
              <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{info.violate_reason}</td>
              <td>{levelMap[info.violate_level]}</td>
              <td>{info.apply_person}</td>
              <td>{info.apply_date}</td>
              <td>{statusMap[info.violate_status] || '未知'}</td>
              <td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {/* 仅“通过”和“拒绝”按钮水平排列 */}
                  {info.violate_status === 1 && (
                    <>
                      <button
                        onClick={() => handleAction('/api/violateApply/pass', { id: info.violate_id, username: 'test_user' }, info.violate_id)}
                        disabled={processing === info.violate_id}
                        className="btn"
                        style={{ padding: '5px 15px' }}
                      >
                        {processing === info.violate_id ? '处理中...' : '通过'}
                      </button>
                      <button
                        onClick={() => handleAction('/api/violateApply/refuse', { id: info.violate_id, username: 'test_user' }, info.violate_id)}
                        disabled={processing === info.violate_id}
                        className="btn btn-secondary"
                        style={{ padding: '5px 15px' }}
                      >
                        {processing === info.violate_id ? '处理中...' : '拒绝'}
                      </button>
                    </>
                  )}
                  {info.violate_status === 3 && (
                    <>
                      <button
                        onClick={() => handleAction('/api/recoverApply/pass', { violateId: info.violate_id, username: 'test_user' }, info.violate_id)}
                        disabled={processing === info.violate_id}
                        className="btn"
                        style={{ padding: '5px 15px' }}
                      >
                        {processing === info.violate_id ? '处理中...' : '通过恢复'}
                      </button>
                      <button
                        onClick={() => handleAction('/api/recoverApply/refuse', { violateId: info.violate_id, username: 'test_user' }, info.violate_id)}
                        disabled={processing === info.violate_id}
                        className="btn btn-secondary"
                        style={{ padding: '5px 15px' }}
                      >
                        {processing === info.violate_id ? '处理中...' : '拒绝恢复'}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 新增违规申请表单组件
const AddViolateApplyForm = ({ onApplyAdded, onCancel }) => {
  const [customerId, setCustomerId] = useState('');
  const [violateReason, setViolateReason] = useState('');
  const [violateLevel, setViolateLevel] = useState(1);
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reasonOptions = [
    '6 个月内，交易对手技术性或资金等原因，给当天结算带来头寸缺口 2 次以上',
    '6 个月内因各种原因导致成交后撤单 2 次以上',
    '未能按照合约规定支付或延期支付利息，本金或其他交付义务（不包括在宽限期内延期支付）',
    '关联违约：如果集团（内部联系较紧密的集团）或集团内任一公司（较重要的子公司，一旦发生违约会对整个集团造成较大影响的）发生违约，可视情况作为集团内所有成员违约的触发条件',
    '发生消极债务置换：债务人提供给债权人新的或重组的债务，或新的证券组合、现金或资产低于原有金融义务；或为了债务人未来避免发生破产或拖欠还款而进行的展期或重组',
    '申请破产保护，发生法律接管，或者处于类似的破产保护状态',
    '在其他金融机构违约（包括不限于：人行征信记录中显示贷款分类状态不良类情况，逾期超过 90 天等），或外部评级显示为违约'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!customerId || !violateReason) {
      setError('客户ID和违规原因为必填项');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/violateApply/insertApply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: parseInt(customerId),
          violateReason,
          violateLevel,
          remark,
          username: 'test_user',
        }),
      });
      const result = await response.json();
      if (result.code === 200) onApplyAdded();
      else setError(result.msg || '未知错误');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', margin: '20px 0' }}>
      <h4>新增违规申请</h4>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>客户ID:</label>
          <input
            type="number"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            required
            style={{ flex: 1, padding: '5px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>违规原因:</label>
          <select
            value={violateReason}
            onChange={e => setViolateReason(e.target.value)}
            required
            style={{ flex: 1, padding: '5px' }}
          >
            <option value="">请选择违规原因</option>
            {reasonOptions.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>违规等级:</label>
          <select
            value={violateLevel}
            onChange={e => setViolateLevel(parseInt(e.target.value))}
            required
            style={{ flex: 1, padding: '5px' }}
          >
            {levelOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ width: '100px' }}>备注:</label>
          <input
            type="text"
            value={remark}
            onChange={e => setRemark(e.target.value)}
            style={{ flex: 1, padding: '5px' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn" disabled={submitting} style={{ padding: '5px 15px' }}>
            {submitting ? '提交中...' : '提交'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ padding: '5px 15px' }}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViolateApply;
