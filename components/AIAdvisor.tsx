import React, { useState } from 'react';
import { CallRecord } from '../types';
import { analyzePortfolio } from '../services/geminiService';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  assets: CallRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ assets, isOpen, onClose }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerateAnalysis = async () => {
    if (assets.length === 0) {
      setAnalysis("Please add assets to your portfolio before running the analysis.");
      return;
    }
    setLoading(true);
    const result = await analyzePortfolio(assets);
    setAnalysis(result);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={20} />
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Gemini Insights
          </h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!analysis && !loading && (
          <div className="text-center text-slate-400 mt-10">
            <Sparkles size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="mb-6">
              Unlock professional insights about your portfolio allocation, risk factors, and potential opportunities.
            </p>
            <button
              onClick={handleGenerateAnalysis}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Generate AI Report
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <RefreshCw className="animate-spin mb-4 text-purple-500" size={32} />
            <p>Analyzing portfolio structure...</p>
            <p className="text-xs text-slate-500 mt-2">Checking diversification & risks</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="prose prose-invert prose-sm max-w-none">
             <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
               <ReactMarkdown>{analysis}</ReactMarkdown>
             </div>
             
             <button
              onClick={handleGenerateAnalysis}
              className="mt-6 flex items-center justify-center w-full px-4 py-2 border border-slate-600 text-slate-300 rounded hover:bg-slate-800 transition-colors text-sm"
            >
              <RefreshCw size={14} className="mr-2" />
              Regenerate Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};