import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, Line, ReferenceLine, ScatterChart, Scatter, ZAxis, Cell 
} from 'recharts';
import { CHART_COLORS as COLORS } from '../constants';
import { CallRecord } from '../types';

interface DashboardChartsProps {
  data: CallRecord[];
  onFilterChange?: (type: 'topic' | 'agent', value: string) => void;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-600 p-4 rounded-lg shadow-2xl backdrop-blur-sm min-w-[200px] z-50">
        <p className="text-slate-100 font-bold mb-2 text-sm uppercase tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.name}:
            </span>
            <span className="text-white font-mono font-bold">
              {typeof entry.value === 'number' 
                ? (entry.name.includes('Rate') || entry.name.includes('%') ? `${entry.value}%` : entry.value.toLocaleString()) 
                : entry.value}
            </span>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 mt-2 italic border-t border-slate-700 pt-1">Click to filter dashboard</p>
      </div>
    );
  }
  return null;
};

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ data, onFilterChange }) => {
  // --- Data Preparation ---

  // 1. Intraday Performance
  const hourlyData = new Map<string, { total: number; answered: number; slaMet: number }>();
  data.forEach(d => {
    const hour = d.time.split(':')[0] + ':00';
    if (!hourlyData.has(hour)) hourlyData.set(hour, { total: 0, answered: 0, slaMet: 0 });
    const stats = hourlyData.get(hour)!;
    stats.total += 1;
    if (d.answered) stats.answered += 1;
    if (d.speedOfAnswer < 20) stats.slaMet += 1; 
  });
  
  const intradayData = Array.from(hourlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([time, stats]) => ({
      time,
      Volume: stats.total,
      'Service Level': parseFloat(((stats.slaMet / stats.total) * 100).toFixed(1)),
      'Answer Rate': parseFloat(((stats.answered / stats.total) * 100).toFixed(1))
    }));

  // 2. Agent Efficiency Matrix
  const agentMap = new Map<string, { count: number; totalDur: number; totalSat: number }>();
  data.forEach(d => {
    if (!agentMap.has(d.agentName)) agentMap.set(d.agentName, { count: 0, totalDur: 0, totalSat: 0 });
    const stats = agentMap.get(d.agentName)!;
    stats.count += 1;
    stats.totalDur += d.duration;
    stats.totalSat += d.satisfactionRating;
  });

  const agentScatterData = Array.from(agentMap.entries()).map(([name, stats]) => ({
    name,
    x: parseFloat((stats.totalDur / stats.count).toFixed(1)),
    y: parseFloat((stats.totalSat / stats.count).toFixed(1)),
    z: stats.count
  }));

  // 3. Topic Impact
  const topicMap = new Map<string, { count: number; resolved: number }>();
  data.forEach(d => {
    if (!topicMap.has(d.topic)) topicMap.set(d.topic, { count: 0, resolved: 0 });
    const stats = topicMap.get(d.topic)!;
    stats.count += 1;
    if (d.resolved) stats.resolved += 1;
  });

  const topicData = Array.from(topicMap.entries())
    .map(([name, stats]) => ({
      name,
      Volume: stats.count,
      'Res Rate': parseFloat(((stats.resolved / stats.count) * 100).toFixed(1))
    }))
    .sort((a, b) => b.Volume - a.Volume);

  // 4. CSAT Distribution
  const csatCounts = [0, 0, 0, 0, 0];
  data.forEach(d => {
    if (d.satisfactionRating >= 1 && d.satisfactionRating <= 5) {
      csatCounts[d.satisfactionRating - 1]++;
    }
  });
  const csatData = csatCounts.map((count, i) => ({
    name: `${i + 1} Star`,
    Count: count,
    Percentage: parseFloat(((count / data.length) * 100).toFixed(1))
  })).reverse();


  const axisStyle = { fill: '#94a3b8', fontSize: 11, fontWeight: 600 };
  const legendStyle = { color: '#e2e8f0', fontSize: '12px', fontWeight: 600 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
      
      {/* 1. Intraday Operations */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Intraday Operations Trend</h3>
            <p className="text-xs text-slate-400">Volume vs Service Level (Target: 80%)</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={intradayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} label={{ value: 'Calls', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={legendStyle} iconType="circle" />
              <Bar yAxisId="left" dataKey="Volume" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="Service Level" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }} activeDot={{ r: 6 }} />
              <ReferenceLine yAxisId="right" y={80} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'right', value: 'Goal', fill: '#f59e0b', fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Agent Efficiency Matrix */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md relative group">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Agent Efficiency Matrix</h3>
            <p className="text-xs text-slate-400">Interact: Click bubble to filter dashboard</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis type="number" dataKey="x" name="Avg AHT (min)" tick={axisStyle} label={{ value: 'Avg Duration (min)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="number" dataKey="y" name="Avg CSAT" tick={axisStyle} domain={[0, 5]} label={{ value: 'CSAT Score', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Calls" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} />
              
              <Scatter 
                name="Agents" 
                data={agentScatterData} 
                fill="#8884d8" 
                cursor="pointer"
                onClick={(e: any) => onFilterChange && onFilterChange('agent', e.name)}
              >
                {agentScatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.y >= 4.5 ? '#10b981' : 
                    entry.y >= 3.5 ? '#3b82f6' : 
                    entry.y >= 2.5 ? '#f59e0b' : '#ef4444' 
                  } />
                ))}
              </Scatter>
              <ReferenceLine x={10} stroke="#475569" strokeDasharray="3 3" />
              <ReferenceLine y={4.0} stroke="#475569" strokeDasharray="3 3" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Topic Impact Analysis */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Topic Impact Analysis</h3>
            <p className="text-xs text-slate-400">Interact: Click bar to filter dashboard</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={topicData} 
                layout="vertical" 
                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.3} />
              <XAxis type="number" tick={axisStyle} hide />
              <YAxis dataKey="name" type="category" tick={axisStyle} width={100} interval={0} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar 
                dataKey="Volume" 
                radius={[0, 4, 4, 0]} 
                barSize={24} 
                name="Total Calls" 
                cursor="pointer"
                onClick={(e: any) => onFilterChange && onFilterChange('topic', e.name)}
              >
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry['Res Rate'] > 85 ? '#10b981' : 
                    entry['Res Rate'] > 60 ? '#f59e0b' : '#ef4444'
                  } fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. CSAT Distribution */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <div className="flex justify-between items-center mb-6">
           <div>
            <h3 className="text-lg font-bold text-white">Customer Satisfaction</h3>
            <p className="text-xs text-slate-400">Rating Distribution vs Target</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={csatData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="Count" radius={[4, 4, 0, 0]} barSize={40} fill="#f59e0b">
                {csatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                        entry.name.startsWith('5') ? '#10b981' : 
                        entry.name.startsWith('4') ? '#34d399' : 
                        entry.name.startsWith('3') ? '#f59e0b' : '#ef4444'
                    } />
                 ))}
              </Bar>
              <ReferenceLine y={data.length * 0.4} label={{ value: 'Target Max', fill: '#94a3b8', fontSize: 10, position: 'right' }} stroke="#475569" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};