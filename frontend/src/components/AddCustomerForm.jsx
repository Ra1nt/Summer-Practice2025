/*
 * @Author: rain l0802_69@qq.com
 * @Date: 2025-09-03 14:30:32
 * @LastEditors: rain l0802_69@qq.com
 * @LastEditTime: 2025-09-04 10:31:41
 * @FilePath: /Summer-Practice2025/frontend/src/components/AddCustomerForm.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';

const AddCustomerForm = ({ onCustomerAdded, onCancel }) => {
  const [customerName, setCustomerName] = useState('');
  const [area, setArea] = useState('');
  const [industry, setIndustry] = useState('');
  const [outsideLevel, setOutsideLevel] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!customerName || !area || !industry || !outsideLevel) {
      setError('All fields are required');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/customer/insertCustomer?customerName=${encodeURIComponent(customerName)}&area=${encodeURIComponent(area)}&industry=${encodeURIComponent(industry)}&outsideLevel=${encodeURIComponent(outsideLevel)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      const result = await response.json();

      if (result.code === 200) {
        onCustomerAdded(); // Notify parent to refresh
      } else {
        setError(result.msg || 'An unknown error occurred');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-customer-form">
      <h4>添加新客户</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>客户名称:</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>地区:</label>
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>行业:</label>
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>外部等级:</label>
          <input type="number" value={outsideLevel} onChange={(e) => setOutsideLevel(e.target.value)} required />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerForm;
 