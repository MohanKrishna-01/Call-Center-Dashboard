import React, { useMemo, useState } from 'react';
import { CallRecord } from '../types';

interface PivotTableProps {
  data: CallRecord[];
}

type GroupByOption = 'agentName' | 'department' | 'topic';

export const PivotTable: React.FC<PivotTableProps> = ({ data }) => {
  const [groupBy, setGroupBy] = useState<GroupByOption>('agentName');

  const pivotData = useMemo(() => {
    const map = new Map<string, { 
      count: number; 
      resolved: number; 
      totalSat: number; 
      totalDuration: number;
      ratedCount: number;
    }>();

    data.forEach(record => {
      const key = record[groupBy];
      if (!map.has(key)) {
        map.set(key, { count: 0, resolved: 0, totalSat: 0, totalDuration: 0, ratedCount: 0 });
      }
      const stats = map.get(key)!;
      stats.count += 1;
      if (record.resolved) stats.resolved += 1;
      if (record.satisfactionRating > 0) {
        stats.totalSat += record.satisfactionRating;
        stats.ratedCount += 1;
      }
      stats.totalDuration += record.duration;
    });

    return Array.from(map.entries()).map(([key, stats]) => ({
      key,
      count: stats.count,
      resolvedRate: (stats.resolved / stats.count * 100),
      avgSat: stats.ratedCount > 0 ? (stats.totalSat / stats.ratedCount) : 0,
      avgDur: (stats.totalDuration / stats.count)
    })).sort((a, b) => b.count - a.count);
  }, [data, groupBy]);

  // Calculate Grand Totals
  const totals = useMemo(() => {
    const totalCalls = pivotData.reduce((acc, curr) => acc + curr.count, 0);
    const weightedRes = pivotData.reduce((acc, curr) => acc + (curr.resolvedRate * curr.count), 0);
    const weightedSat = pivotData.reduce((acc, curr) => acc + (curr.avgSat * curr.count), 0); // Approx
    const totalDur = pivotData.reduce((acc, curr) => acc + (curr.avgDur * curr.count), 0);

    return {
      count: totalCalls,
      resolvedRate: totalCalls ? weightedRes / totalCalls : 0,
      avgSat: totalCalls ? weightedSat / totalCalls : 0,
      avgDur: totalCalls ? totalDur / totalCalls : 0
    };
  }, [pivotData]);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg mb-8 overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
        <h3 className="text-xl font-bold text-white">Summary Pivot Analysis</h3>
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-200">Group By:</span>
            <select 
                value={groupBy} 
                onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
                className="bg-slate-700 border border-slate-600 rounded px-4 py-1.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-600 transition-colors"
            >
                <option value="agentName">Agent</option>
                <option value="department">Department</option>
                <option value="topic">Topic</option>
            </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-600 text-slate-100 text-sm uppercase tracking-wider">
              <th className="p-5 font-bold">{groupBy === 'agentName' ? 'Agent Name' : groupBy === 'department' ? 'Department' : 'Call Topic'}</th>
              <th className="p-5 font-bold text-right">Total Calls</th>
              <th className="p-5 font-bold text-right">Resolution %</th>
              <th className="p-5 font-bold text-right">Avg Satisfaction</th>
              <th className="p-5 font-bold text-right">Avg Duration (min)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {pivotData.map((row) => (
              <tr key={row.key} className="hover:bg-slate-700 transition-colors group">
                <td className="p-5 font-bold text-white group-hover:text-blue-300">{row.key}</td>
                <td className="p-5 text-right text-slate-100 font-bold">{row.count}</td>
                <td className="p-5 text-right">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                    row.resolvedRate >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 
                    row.resolvedRate >= 60 ? 'bg-yellow-500/20 text-yellow-300' : 
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {row.resolvedRate.toFixed(1)}%
                  </span>
                </td>
                <td className="p-5 text-right">
                   <div className="flex justify-end items-center gap-1.5">
                      <span className="text-yellow-400 text-base">★</span>
                      <span className="text-slate-100 font-bold">{row.avgSat.toFixed(1)}</span>
                   </div>
                </td>
                <td className="p-5 text-right text-slate-200 font-mono font-medium">{row.avgDur.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
          {/* Grand Total Footer */}
          <tfoot>
             <tr className="bg-slate-900 border-t-2 border-slate-600">
                <td className="p-5 font-bold text-white uppercase tracking-wider">Grand Total</td>
                <td className="p-5 text-right text-white font-bold">{totals.count}</td>
                <td className="p-5 text-right text-white font-bold">{totals.resolvedRate.toFixed(1)}%</td>
                <td className="p-5 text-right text-white font-bold">{totals.avgSat.toFixed(1)}</td>
                <td className="p-5 text-right text-white font-bold">{totals.avgDur.toFixed(1)}</td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
