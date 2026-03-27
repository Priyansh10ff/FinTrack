import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  Sector,
} from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useState, useCallback } from 'react';

const COLORS = [
  '#6366f1',
  '#059669',
  '#d97706',
  '#dc2626',
  '#0891b2',
  '#db2777',
  '#7c3aed',
  '#0d9488',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      {label && (
        <div style={{ color: '#475569', marginBottom: '0.35rem', fontWeight: 600 }}>{label}</div>
      )}
      {payload.map((entry, i) => (
        <div key={i} style={{ color: entry.color, fontWeight: 600, fontSize: '0.9rem' }}>
          {entry.name}: {formatCurrency(entry.value)}
        </div>
      ))}
    </div>
  );
};

/* Active shape for pie chart on hover */
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value, percent,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#0f172a" fontSize={16} fontWeight={700}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize={13}>
        {formatCurrency(value)}
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" fill="#94a3b8" fontSize={12}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function CategoryPieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  if (chartData.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <p>No expense data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
              opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.4}
            />
          ))}
        </Pie>
        {activeIndex === -1 && <Tooltip content={<CustomTooltip />} />}
        <Legend
          wrapperStyle={{ fontSize: '0.8rem', color: '#475569' }}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <p>No trend data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="month"
          tick={{ fill: '#475569', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={{ stroke: '#cbd5e1' }}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={{ stroke: '#cbd5e1' }}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.85rem', color: '#475569' }} />
        <Line
          type="monotone"
          dataKey="expense"
          name="Expenses"
          stroke="#dc2626"
          strokeWidth={2.5}
          dot={{ fill: '#dc2626', r: 4, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, stroke: '#dc2626', strokeWidth: 2, fill: '#fff' }}
        />
        <Line
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#059669"
          strokeWidth={2.5}
          dot={{ fill: '#059669', r: 4, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, stroke: '#059669', strokeWidth: 2, fill: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function IncomeExpenseBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={6} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#475569', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }} />
        <Legend wrapperStyle={{ fontSize: '0.85rem', color: '#475569' }} iconType="circle" />
        <Bar
          dataKey="income"
          name="Income"
          fill="#059669"
          radius={[6, 6, 0, 0]}
          maxBarSize={44}
        />
        <Bar
          dataKey="expense"
          name="Expenses"
          fill="#dc2626"
          radius={[6, 6, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
