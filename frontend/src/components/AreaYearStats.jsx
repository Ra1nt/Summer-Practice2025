import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const AreaYearStats = () => {
  const [area, setArea] = useState("");
  const [year, setYear] = useState(""); // 可选年份
  const [listData, setListData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // 可选年份（近 10 年）
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const fetchList = async () => {
    let query = [];
    if (area) query.push(`area=${area}`);
    if (year) query.push(`year=${year}`);
    const queryString = query.length ? `?${query.join('&')}` : '';

    try {
      const res = await fetch(`/api/stats/area-year/list${queryString}`);
      const result = await res.json();
      if (result.code === 200) {
        setListData(result.data.list || []);
        processChartData(result.data.list || []);
      } else {
        alert(result.msg);
      }
    } catch (err) {
      alert('请求出错: ' + err.message);
    }
  };

  // 按年份统计同一地区的违约/已恢复数量
  const processChartData = (list) => {
    const map = {};
    list.forEach(item => {
      const yearKey = item.applyDate ? new Date(item.applyDate).getFullYear() : "未知年份";
      if (!map[yearKey]) map[yearKey] = { year: yearKey, violateCount: 0, recoveredCount: 0 };
      map[yearKey].violateCount += 1;
      if (item.recovered) map[yearKey].recoveredCount += 1;
    });
    const sortedData = Object.values(map).sort((a, b) => a.year - b.year);
    setChartData(sortedData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>地区违规统计</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="地区 (可选)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">年份 (可选)</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button onClick={fetchList}>查询列表</button>
      </div>

      <h4>违规记录列表</h4>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>违规ID</th>
            <th>客户ID</th>
            <th>客户姓名</th>
            <th>行业</th>
            <th>地区</th>
            <th>违规等级</th>
            <th>违规原因</th>
            <th>状态</th>
            <th>申请日期</th>
          </tr>
        </thead>
        <tbody>
          {listData.map((item) => (
            <tr key={item.violateId}>
              <td>{item.violateId}</td>
              <td>{item.customerId}</td>
              <td>{item.customerName}</td>
              <td>{item.industry}</td>
              <td>{item.area}</td>
              <td>{item.violateLevel}</td>
              <td>{item.violateReason}</td>
              <td>{item.status === 0 ? "正常" : "违规"}</td>
              <td>{item.applyDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>图表统计（按年份展示）</h4>
      <p>显示同一地区不同年份的违约主体数量和已恢复主体数量趋势。</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="violateCount" fill="#FF8042" name="违约主体数量" />
          <Bar dataKey="recoveredCount" fill="#00C49F" name="已恢复主体数量" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
          <p>各年份违约主体占比</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="violateCount"
                nameKey="year"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
          <p>各年份已恢复主体占比</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="recoveredCount"
                nameKey="year"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AreaYearStats;
