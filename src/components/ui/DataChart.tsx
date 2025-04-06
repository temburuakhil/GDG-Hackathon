
import React from 'react';
import { Bar, Line, Area, Pie, PieChart, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DataChartProps {
  type: 'bar' | 'line' | 'area' | 'pie';
  data: any[];
  dataKeys?: string[];
  colors?: string[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

const DEFAULT_COLORS = [
  '#5C832F', // forest green (primary)
  '#8B4513', // saddle brown (secondary)
  '#78552B', // rustic brown (accent)
  '#A6753C', // light saddle brown
  '#8CAC67', // light forest green
  '#3E5920', // dark forest green
  '#5F2F0D', // dark saddle brown
];

const DataChart: React.FC<DataChartProps> = ({
  type,
  data,
  dataKeys = [],
  colors = DEFAULT_COLORS,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Handle pie chart separately
  if (type === 'pie') {
    // Check if data is formatted for pie chart
    const pieData = data.map(item => ({
      name: item.name || 'Unknown',
      value: typeof item.value === 'string' ? parseFloat(item.value) || 0 : (item.value || 0),
      color: item.color,
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          {showTooltip && <Tooltip />}
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Ensure data is in the right format with all required keys
  const preparedData = data.map(item => {
    const newItem = { ...item };
    // Make sure xAxisKey exists in each data point
    if (!newItem[xAxisKey]) {
      newItem[xAxisKey] = 'Unknown';
    }
    
    // Make sure all dataKeys exist in each data point
    dataKeys.forEach(key => {
      if (typeof newItem[key] === 'undefined') {
        newItem[key] = 0;
      }
    });
    
    return newItem;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={preparedData}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        {showTooltip && <Tooltip />}
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        
        {dataKeys.map((dataKey, index) => {
          const color = colors[index % colors.length];
          
          if (type === 'bar') {
            return (
              <Bar 
                key={dataKey} 
                dataKey={dataKey} 
                fill={color} 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            );
          }
          
          if (type === 'line') {
            return (
              <Line
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4, fill: color }}
                activeDot={{ r: 6 }}
              />
            );
          }
          
          if (type === 'area') {
            return (
              <Area
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={`${color}33`}
                strokeWidth={2}
                dot={{ r: 4, fill: color }}
                activeDot={{ r: 6 }}
              />
            );
          }
          
          return null;
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
