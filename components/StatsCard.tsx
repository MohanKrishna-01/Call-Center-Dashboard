import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string; // e.g. "+5.2%"
  isPositive?: boolean;
  icon?: 'dollar' | 'percent' | 'chart';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:border-slate-500 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-300 text-sm font-bold tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 drop-shadow-sm">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl shadow-inner ${
          icon === 'dollar' ? 'bg-blue-500/20 text-blue-300' : 
          icon === 'percent' ? 'bg-purple-500/20 text-purple-300' :
          'bg-emerald-500/20 text-emerald-300'
        }`}>
          {icon === 'dollar' && <DollarSign size={24} strokeWidth={2.5} />}
          {icon === 'percent' && <Activity size={24} strokeWidth={2.5} />}
          {icon === 'chart' && <Activity size={24} strokeWidth={2.5} />}
        </div>
      </div>
      
      {change && (
        <div className="flex items-center mt-2">
          {isPositive ? (
            <ArrowUpRight size={20} className="text-emerald-400 mr-1" strokeWidth={2.5} />
          ) : (
            <ArrowDownRight size={20} className="text-red-400 mr-1" strokeWidth={2.5} />
          )}
          <span className={`text-base font-extrabold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {change}
          </span>
          <span className="text-slate-300 text-sm ml-2 font-semibold">vs yesterday</span>
        </div>
      )}
    </div>
  );
};
