import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const IndustryYearStats = () => {
  const [industry, setIndustry] = useState("");
  const [year, setYear] = useState(""); // 年份可选
  const [listData, setListData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // 查询列表
  const fetchList = async () => {
    let query = [];
    if (industry) query.push(`industry=${industry}`);
    if (year) query.push(`year=${year}`);
    const queryString = query.length ? `?${query.join('&')}` : '';

    try {
      const res = await fetch(`/api/stats/industry-year/list${queryString}`);
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

  // 处理图表数据：按年份分组显示某行业的统计
  const processChartData = (list) => {
    const map = {};
    list.forEach(item => {
      const key = industry ? (item.applyDate ? new Date(item.applyDate).getFullYear() : "未知年份") : item.industry || "未知行业";
      if (!map[key]) map[key] = { label: key, violateCount: 0, recoveredCount: 0 };
      map[key].violateCount += 1;
      if (item.recovered) map[key].recoveredCount += 1;
    });
    setChartData(Object.values(map));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>行业违规统计</h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="行业 (可选)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <input
          type="number"
          placeholder="年份 (可选)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
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
            <th>年份</th>
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
              <td>{item.applyDate ? new Date(item.applyDate).getFullYear() : "未知年份"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>图表统计</h4>
      <p>柱状图显示各年份或各行业的违约主体数量和已恢复主体数量，便于对比分析趋势。</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="violateCount" fill="#FF8042" name="违约主体数量" />
          <Bar dataKey="recoveredCount" fill="#00C49F" name="已恢复主体数量" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
          <p>各年份或行业违约主体占比</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="violateCount"
                nameKey="label"
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
          <p>各年份或行业已恢复主体占比</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="recoveredCount"
                nameKey="label"
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

export default IndustryYearStats;
