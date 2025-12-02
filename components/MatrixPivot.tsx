import React, { useMemo, useState } from 'react';
import { CallRecord } from '../types';
import { Settings2, ArrowRightLeft } from 'lucide-react';

interface MatrixPivotProps {
  data: CallRecord[];
}

type Dimension = 'agentName' | 'department' | 'topic' | 'date' | 'satisfactionRating';

const DIMENSION_LABELS: Record<Dimension, string> = {
  agentName: 'Agent',
  department: 'Department',
  topic: 'Topic',
  date: 'Date',
  satisfactionRating: 'CSAT Score'
};

export const MatrixPivot: React.FC<MatrixPivotProps> = ({ data }) => {
  const [rowDim, setRowDim] = useState<Dimension>('agentName');
  const [colDim, setColDim] = useState<Dimension>('topic');

  const { matrix, rows, cols, colTotals, rowTotals, grandTotal } = useMemo(() => {
    // Get unique values for rows and columns
    const rowSet = new Set<string>();
    const colSet = new Set<string>();

    data.forEach(d => {
      rowSet.add(String(d[rowDim]));
      colSet.add(String(d[colDim]));
    });

    const rows = Array.from(rowSet).sort();
    const cols = Array.from(colSet).sort();

    const matrix: Record<string, Record<string, number>> = {};
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};
    let grandTotal = 0;

    // Initialize
    rows.forEach(r => {
      matrix[r] = {};
      rowTotals[r] = 0;
    });
    cols.forEach(c => {
      colTotals[c] = 0;
    });

    // Fill Matrix
    data.forEach(d => {
      const rKey = String(d[rowDim]);
      const cKey = String(d[colDim]);
      
      if (!matrix[rKey][cKey]) matrix[rKey][cKey] = 0;
      matrix[rKey][cKey]++;
      
      rowTotals[rKey]++;
      colTotals[cKey]++;
      grandTotal++;
    });

    return { matrix, rows, cols, colTotals, rowTotals, grandTotal };
  }, [data, rowDim, colDim]);

  // Helper for heatmap intensity
  const getIntensityClass = (value: number, total: number) => {
    if (value === 0) return 'text-slate-600';
    const percentage = value / total;
    if (percentage > 0.3) return 'bg-blue-600 text-white font-extrabold shadow-md';
    if (percentage > 0.15) return 'bg-blue-500/60 text-white font-bold';
    return 'bg-blue-500/20 text-blue-100 font-medium';
  };

  const swapDimensions = () => {
    setRowDim(colDim);
    setColDim(rowDim);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg mb-8 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-700 bg-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings2 size={20} className="text-blue-400" />
            Matrix Pivot
          </h3>
          <p className="text-slate-300 text-xs font-semibold mt-1 tracking-wide uppercase">Dynamic Cross-Tabulation</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
          <select 
            value={rowDim} 
            onChange={(e) => setRowDim(e.target.value as Dimension)}
            className="bg-slate-800 text-white text-xs font-bold rounded px-2 py-1.5 border border-slate-600 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
               <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <button onClick={swapDimensions} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Swap Axis">
             <ArrowRightLeft size={14} />
          </button>

          <select 
            value={colDim} 
            onChange={(e) => setColDim(e.target.value as Dimension)}
            className="bg-slate-800 text-white text-xs font-bold rounded px-2 py-1.5 border border-slate-600 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
               <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
              <th className="p-3 border-b border-r border-slate-700 sticky left-0 bg-slate-900 z-20 min-w-[140px]">
                {DIMENSION_LABELS[rowDim]} \ {DIMENSION_LABELS[colDim]}
              </th>
              {cols.map(c => (
                <th key={c} className="p-3 border-b border-slate-700 text-center min-w-[100px] text-slate-300">
                  {c}
                </th>
              ))}
              <th className="p-3 border-b border-l border-slate-700 text-center bg-slate-900/50 min-w-[80px]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {rows.map(r => (
              <tr key={r} className="hover:bg-slate-700/50 transition-colors">
                <td className="p-3 font-bold text-slate-100 border-r border-slate-700 sticky left-0 bg-slate-800 z-10 shadow-sm whitespace-nowrap text-sm">
                  {r}
                </td>
                {cols.map(c => {
                  const count = matrix[r][c] || 0;
                  return (
                    <td key={`${r}-${c}`} className="p-2 border-slate-700 text-center">
                      <div className={`py-1.5 px-2 rounded mx-auto w-10 text-xs transition-all ${getIntensityClass(count, rowTotals[r])}`}>
                        {count > 0 ? count : '-'}
                      </div>
                    </td>
                  );
                })}
                <td className="p-3 font-bold text-white text-center border-l border-slate-700 bg-slate-800/30 text-sm">
                  {rowTotals[r]}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900 font-bold text-white border-t-2 border-slate-600 text-xs uppercase">
              <td className="p-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-700">Grand Total</td>
              {cols.map(c => (
                <td key={`total-${c}`} className="p-3 text-center text-blue-300">
                  {colTotals[c]}
                </td>
              ))}
              <td className="p-3 text-center text-emerald-400 text-base border-l border-slate-700">
                {grandTotal}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};