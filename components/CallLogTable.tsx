import React, { useState, useMemo } from 'react';
import { CallRecord } from '../types';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface CallLogTableProps {
  data: CallRecord[];
}

type SortKey = keyof CallRecord;
type SortDirection = 'asc' | 'desc';

export const CallLogTable: React.FC<CallLogTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Search Filter
  const searchedData = useMemo(() => {
    return data.filter(record => 
      record.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // 2. Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return searchedData;

    return [...searchedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchedData, sortConfig]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <span className="opacity-0 group-hover:opacity-30 ml-1">↕</span>;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1 inline" /> : <ChevronDown size={14} className="ml-1 inline" />;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg flex flex-col h-full">
      <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800">
        <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Call Log Dataset</h3>
            <span className="text-xs font-bold text-slate-200 bg-slate-700 px-3 py-1 rounded-full border border-slate-600">
            {searchedData.length} RECORDS
            </span>
        </div>
        
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300" size={18} />
            <input 
                type="text" 
                placeholder="Search agent, topic, or ID..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none hover:bg-slate-600 transition-colors font-medium"
            />
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 sticky top-0 z-10 shadow-sm">
            <tr className="text-slate-100 text-xs font-bold uppercase tracking-wider border-b border-slate-600">
              <th onClick={() => handleSort('id')} className="p-5 cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Call ID <SortIcon columnKey="id"/></th>
              <th onClick={() => handleSort('date')} className="p-5 cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Date & Time <SortIcon columnKey="date"/></th>
              <th onClick={() => handleSort('agentName')} className="p-5 cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Agent <SortIcon columnKey="agentName"/></th>
              <th onClick={() => handleSort('department')} className="p-5 cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Department <SortIcon columnKey="department"/></th>
              <th onClick={() => handleSort('topic')} className="p-5 cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Topic <SortIcon columnKey="topic"/></th>
              <th onClick={() => handleSort('answered')} className="p-5 text-center cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Answered <SortIcon columnKey="answered"/></th>
              <th onClick={() => handleSort('resolved')} className="p-5 text-center cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Resolved <SortIcon columnKey="resolved"/></th>
              <th onClick={() => handleSort('duration')} className="p-5 text-right cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">Duration <SortIcon columnKey="duration"/></th>
              <th onClick={() => handleSort('satisfactionRating')} className="p-5 text-center cursor-pointer hover:bg-slate-800 hover:text-blue-300 transition-colors group">CSAT <SortIcon columnKey="satisfactionRating"/></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {paginatedData.map((record) => (
              <tr key={record.id} className="hover:bg-slate-700/50 transition-colors text-sm group">
                <td className="p-5 font-mono text-blue-300 font-bold">{record.id}</td>
                <td className="p-5 text-slate-100">
                    <div className="font-bold">{record.date}</div>
                    <div className="text-xs text-slate-300 font-mono">{record.time}</div>
                </td>
                <td className="p-5 font-bold text-white group-hover:text-blue-200">{record.agentName}</td>
                <td className="p-5 text-slate-200 font-medium">{record.department}</td>
                <td className="p-5 text-slate-100 font-medium">{record.topic}</td>
                <td className="p-5 text-center">
                    <span className={`inline-block w-3 h-3 rounded-full shadow-sm ${record.answered ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}></span>
                </td>
                <td className="p-5 text-center">
                     {record.answered ? (
                        <span className={`px-3 py-1 rounded-md text-[11px] uppercase font-bold tracking-wide ${
                            record.resolved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20'
                        }`}>
                            {record.resolved ? 'Yes' : 'No'}
                        </span>
                     ) : <span className="text-slate-500 font-bold">-</span>}
                </td>
                <td className="p-5 text-right text-slate-100 font-mono font-bold">
                    {record.duration > 0 ? `${record.duration}m` : '-'}
                </td>
                <td className="p-5 text-center">
                    {record.satisfactionRating > 0 ? (
                        <div className="flex justify-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < record.satisfactionRating ? "text-yellow-400 drop-shadow-sm text-base" : "text-slate-600 text-base"}>★</span>
                            ))}
                        </div>
                    ) : <span className="text-slate-500 text-xs">N/A</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-slate-900/50 border-t border-slate-700 p-4 flex items-center justify-between">
         <span className="text-xs text-slate-400 font-medium">
            Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
         </span>
         
         <div className="flex items-center gap-2">
            <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronsLeft size={16} />
            </button>
            <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronLeft size={16} />
            </button>
            
            <div className="flex gap-1">
               {/* Simple Page Indicator */}
               {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  // Logic to show pages around current page could go here
                  // For simplicity, showing first 5 or logic needs to be complex
                  // Let's just show current page context
                  return null; 
               })}
            </div>

            <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronRight size={16} />
            </button>
            <button 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ChevronsRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};