import React from 'react';
import { ArrowLeft, RefreshCw, Plus, Minus, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import { Team } from '../types';
import { CustomBarLabel, CustomTick } from './ChartComponents';

interface LiveScreenProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onBack: () => void;
}

export const LiveScreen: React.FC<LiveScreenProps> = ({ teams, setTeams, onBack }) => {

  const updateScore = (id: string, delta: number) => {
    setTeams(teams.map(t => {
      if (t.id === id) {
        const newScore = Math.max(0, t.score + delta);
        return { ...t, score: newScore };
      }
      return t;
    }));
  };

  const resetScores = () => {
    if (confirm("Weet je zeker dat je alle scores wilt wissen?")) {
      setTeams(teams.map(t => ({ ...t, score: 0 })));
    }
  };

  // Calculate stats for the chart
  const maxScore = Math.max(...teams.map(t => t.score));
  
  // Sort teams by score ONLY for the leaderboard list on the side
  const sortedLeaderboard = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg z-10 h-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Configuratie</span>
        </button>
        
        <h1 className="text-2xl md:text-4xl font-display flex items-center gap-3 text-[#4f86f7] tracking-wide drop-shadow-md">
          <Trophy className="text-yellow-500 fill-yellow-500/20 w-8 h-8" strokeWidth={2.5} />
          <span>Scorebord Live</span>
        </h1>

        <button 
          onClick={resetScores}
          className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-700 border border-slate-700"
          title="Reset alle scores"
        >
            <RefreshCw size={20} />
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT: Live Chart */}
        <div className="flex-1 p-6 flex flex-col min-h-[50vh] lg:min-h-0 relative bg-slate-900">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0 pointer-events-none" />
            
            <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 p-4 shadow-2xl relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={teams} // Using original order so bars don't swap positions
                    margin={{ top: 60, right: 30, left: 20, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={<CustomTick teams={teams} />}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                        interval={0}
                    />
                    <YAxis 
                        stroke="#64748b" 
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}
                        itemStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    />
                    <Bar 
                        dataKey="score" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                        isAnimationActive={true}
                    >
                        {teams.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} />
                        ))}
                        <LabelList 
                            dataKey="score" 
                            content={<CustomBarLabel maxScore={maxScore} teams={teams} />} 
                        />
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* RIGHT: Controls & Leaderboard List */}
        <div className="w-full lg:w-[420px] bg-slate-800 border-l border-slate-700 flex flex-col shadow-2xl z-20">
          <div className="p-5 bg-slate-800 border-b border-slate-700">
            <h2 className="text-xl font-display text-slate-100 mb-1">Score Bediening</h2>
            <p className="text-sm text-slate-400">Beheer punten per team</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/30">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="bg-slate-700 rounded-xl p-4 border border-slate-600 shadow-sm transition-all hover:bg-slate-700/80"
                style={{ borderLeft: `5px solid ${team.color}` }}
              >
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-slate-100 text-lg leading-tight">{team.name}</h3>
                        <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-1">
                            {team.members.split(',').map((m, i) => (
                                <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-600">{m.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white bg-slate-900 px-3 py-1 rounded-lg min-w-[3ch] text-center border border-slate-600 shadow-inner">
                        {team.score}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <button 
                        onClick={() => updateScore(team.id, -1)}
                        className="bg-slate-800 hover:bg-slate-600 text-slate-400 hover:text-red-400 border border-slate-600 rounded-lg py-2 flex items-center justify-center transition-all active:scale-95"
                    >
                        <Minus size={18} />
                    </button>
                    <button 
                        onClick={() => updateScore(team.id, 1)}
                        className="col-span-2 bg-[#4f86f7] hover:bg-blue-600 text-white font-bold rounded-lg py-2 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm shadow-black/20"
                    >
                        <Plus size={20} />
                        <span>1 Punt</span>
                    </button>
                    <button 
                        onClick={() => updateScore(team.id, 5)}
                        className="bg-slate-800 hover:bg-emerald-900/30 text-emerald-400 border border-slate-600 hover:border-emerald-700 font-bold rounded-lg py-2 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                        +5
                    </button>
                </div>
              </div>
            ))}
          </div>

            {/* Mini Leaderboard Text */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Huidige Top 3</h3>
             <div className="space-y-2">
                {sortedLeaderboard.slice(0, 3).map((team, idx) => (
                    <div key={team.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                                idx === 0 ? 'bg-yellow-500 text-white' : 
                                idx === 1 ? 'bg-slate-400 text-slate-900' : 'bg-orange-500 text-white'
                            }`}>
                                {idx + 1}
                            </span>
                            <span className="text-slate-200 font-semibold">{team.name}</span>
                        </div>
                        <span className="font-mono font-bold text-white bg-slate-900 px-2 rounded border border-slate-700">{team.score}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};