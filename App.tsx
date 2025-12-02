import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Phone, Users, FileText, Sparkles, Filter, Calendar, Download, Printer, Bell, X, AlertTriangle } from 'lucide-react';
import { MOCK_CALL_DATA } from './constants';
import { StatsCard } from './components/StatsCard';
import { DashboardCharts } from './components/DashboardCharts';
import { PivotTable } from './components/PivotTable';
import { MatrixPivot } from './components/MatrixPivot';
import { CallLogTable } from './components/CallLogTable';
import { AIAdvisor } from './components/AIAdvisor';

export default function App() {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [data] = useState(MOCK_CALL_DATA);
  
  // Dashboard Slicers & Drill-down State
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const [timeRange, setTimeRange] = useState<string>('All Time');

  // Extract unique departments for the filter
  const departments = useMemo(() => {
    const depts = new Set(data.map(d => d.department));
    return ['All', ...Array.from(depts).sort()];
  }, [data]);

  // Filter Data based on ALL active filters (Slice & Dice)
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchDept = selectedDept === 'All' || item.department === selectedDept;
      const matchTopic = selectedTopic ? item.topic === selectedTopic : true;
      const matchAgent = selectedAgent ? item.agentName === selectedAgent : true;
      const matchTime = timeRange === 'All Time' ? true : true; 
      return matchDept && matchTime && matchTopic && matchAgent;
    });
  }, [data, selectedDept, timeRange, selectedTopic, selectedAgent]);

  // Handle Drill-down from Charts
  const handleChartFilter = (type: 'topic' | 'agent', value: string) => {
    if (type === 'topic') setSelectedTopic(value === selectedTopic ? null : value);
    if (type === 'agent') setSelectedAgent(value === selectedAgent ? null : value);
  };

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalCalls = filteredData.length;
    const answered = filteredData.filter(d => d.answered).length;
    const resolved = filteredData.filter(d => d.resolved).length;
    const totalSat = filteredData.reduce((acc, curr) => acc + curr.satisfactionRating, 0);
    const ratedCalls = filteredData.filter(d => d.satisfactionRating > 0).length;
    
    return {
      totalCalls,
      answerRate: totalCalls ? (answered / totalCalls) * 100 : 0,
      resolutionRate: totalCalls ? (resolved / totalCalls) * 100 : 0,
      avgSat: ratedCalls > 0 ? (totalSat / ratedCalls) : 0,
      avgDuration: totalCalls ? filteredData.reduce((acc, curr) => acc + curr.duration, 0) / totalCalls : 0
    };
  }, [filteredData]);

  // Export & Print
  const handleExport = () => {
    const headers = ["ID", "Agent", "Dept", "Topic", "Date", "Time", "Duration", "CSAT", "Resolved"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(d => 
        [d.id, d.agentName, d.department, d.topic, d.date, d.time, d.duration, d.satisfactionRating, d.resolved ? "Yes" : "No"].join(",")
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Call_Center_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex font-sans selection:bg-blue-500/30 print:bg-white print:text-black overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex-col hidden sm:flex sticky top-0 h-screen z-20 shadow-xl print:hidden">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Phone className="text-white" size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight hidden lg:block text-white">CallDash</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-600/10 border border-blue-500/50 text-blue-400 font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <LayoutDashboard size={20} />
            <span className="hidden lg:block">Overview</span>
          </button>
          <button onClick={() => setIsAdvisorOpen(true)} className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-purple-400 transition-colors font-medium">
            <Sparkles size={20} />
            <span className="hidden lg:block">Ops Insights</span>
          </button>
           <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors font-medium">
            <Users size={20} />
            <span className="hidden lg:block">Agents</span>
          </button>
           <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors font-medium">
            <FileText size={20} />
            <span className="hidden lg:block">Reports</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800 hidden lg:block">
           <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 shadow-inner">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Live Status</h4>
               <div className="flex items-center gap-2">
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                   <span className="text-sm font-bold text-emerald-400">System Online</span>
               </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
        
        {/* Live Ticker Bar */}
        <div className="bg-blue-900/30 border-b border-blue-500/20 h-8 flex items-center overflow-hidden print:hidden relative">
           <div className="absolute left-0 bg-blue-900/80 px-3 h-full flex items-center z-10 border-r border-blue-500/30">
              <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
                 <Bell size={10} className="text-blue-400" /> Live Alerts
              </span>
           </div>
           <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs font-medium text-blue-200">
              <span className="flex items-center gap-2"><AlertTriangle size={12} className="text-amber-400"/> High volume detected in Billing Department (+15% vs Avg)</span>
              <span className="flex items-center gap-2"><AlertTriangle size={12} className="text-emerald-400"/> Service Level Objective MET for Technical Support</span>
              <span className="flex items-center gap-2"><AlertTriangle size={12} className="text-purple-400"/> Agent 'Sarah Conner' exceeds daily CSAT target (4.9/5.0)</span>
              <span>System Update scheduled for 02:00 AM UTC</span>
           </div>
        </div>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth">
          {/* Header & Slicers */}
          <header className="flex flex-col gap-6 mb-8 print:hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Call Center Dashboard</h1>
                <p className="text-slate-300 text-sm mt-1 font-semibold">Real-time Operations & Performance Analytics</p>
              </div>
              <div className="flex gap-3">
                 <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-all text-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-all text-sm"
                >
                  <Printer size={16} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                 <button 
                  onClick={() => setIsAdvisorOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transform hover:-translate-y-0.5 text-sm"
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">AI Analysis</span>
                </button>
              </div>
            </div>

            {/* Slicers (Filters) */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md flex flex-wrap items-center gap-6">
               <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-wider border-r border-slate-700 pr-6">
                  <Filter size={14} />
                  <span>Filters</span>
               </div>
               
               {/* Department Slicer */}
               <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-300">Department:</span>
                  <div className="flex flex-wrap gap-1">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDept(dept)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          selectedDept === dept 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Time Slicer */}
               <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm font-semibold text-slate-300">Period:</span>
                  <div className="flex items-center bg-slate-900 rounded-lg px-3 py-1.5 border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-500 transition-colors cursor-pointer group">
                    <Calendar size={14} className="mr-2 text-slate-400 group-hover:text-white" />
                    <span>Last 7 Days</span>
                  </div>
               </div>
            </div>

            {/* Active Drill-down Chips */}
            {(selectedTopic || selectedAgent) && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-xs font-bold text-slate-500 uppercase">Active View:</span>
                {selectedTopic && (
                  <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-1 bg-purple-500/20 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold hover:bg-purple-500/30 transition-colors">
                    Topic: {selectedTopic} <X size={12} />
                  </button>
                )}
                {selectedAgent && (
                  <button onClick={() => setSelectedAgent(null)} className="flex items-center gap-1 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold hover:bg-emerald-500/30 transition-colors">
                    Agent: {selectedAgent} <X size={12} />
                  </button>
                )}
                <button onClick={() => {setSelectedAgent(null); setSelectedTopic(null);}} className="text-xs text-slate-400 hover:text-white underline ml-2">
                  Clear All
                </button>
              </div>
            )}
          </header>

          {/* Print Only Header */}
          <div className="hidden print:block mb-8">
              <h1 className="text-2xl font-bold text-black mb-2">Call Center Performance Report</h1>
              <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Calls" value={kpis.totalCalls.toString()} change="+12" isPositive={true} icon="chart" />
            <StatsCard title="Resolution Rate" value={`${kpis.resolutionRate.toFixed(1)}%`} change="-2.1%" isPositive={false} icon="percent" />
            <StatsCard title="Avg. CSAT Score" value={`${kpis.avgSat.toFixed(1)}/5`} change="+0.2" isPositive={true} icon="dollar" />
            <StatsCard title="Avg. Duration" value={`${kpis.avgDuration.toFixed(1)}m`} change="-0.5m" isPositive={true} icon="percent" />
          </div>

          {/* Main Charts with Interaction */}
          <DashboardCharts data={filteredData} onFilterChange={handleChartFilter} />

          {/* Pivot Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 print:break-inside-avoid">
            <PivotTable data={filteredData} />
            <MatrixPivot data={filteredData} />
          </div>

          {/* Detailed Data Table */}
          <div className="print:break-before-page">
              <CallLogTable data={filteredData} />
          </div>

          <AIAdvisor 
            assets={filteredData}
            isOpen={isAdvisorOpen} 
            onClose={() => setIsAdvisorOpen(false)} 
          />
        </div>
      </main>
    </div>
  );
}