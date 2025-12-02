import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Plus, Minus, Trophy, Maximize2, Minimize2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import { Team } from '../types';
import { CustomBarLabel, CustomTick } from './ChartComponents';

interface LiveScreenProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onBack: () => void;
}

export const LiveScreen: React.FC<LiveScreenProps> = ({ teams, setTeams, onBack }) => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-900">
      {/* Header - Compact */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center shadow-md z-20 shrink-0 h-16">
        <div className="flex items-center gap-4">
            <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors font-medium text-sm"
            >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Configuratie</span>
            </button>
            
            <h1 className="text-xl md:text-2xl font-display flex items-center gap-2 text-[#4f86f7] tracking-wide drop-shadow-md">
            <Trophy className="text-yellow-500 fill-yellow-500/20 w-6 h-6" strokeWidth={2.5} />
            <span className="hidden md:inline">Scorebord Live</span>
            </h1>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className={`flex items-center gap-2 transition-colors p-2 rounded-full border ${isPresentationMode ? 'bg-[#4f86f7] text-white border-[#4f86f7]' : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-[#4f86f7]'}`}
                title={isPresentationMode ? "Sluit presentatiemodus" : "Presentatiemodus (groot scherm)"}
            >
                {isPresentationMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            <button 
            onClick={resetScores}
            className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors bg-slate-800 p-2 rounded-full hover:bg-slate-700 border border-slate-700"
            title="Reset alle scores"
            >
                <RefreshCw size={20} />
            </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT: Live Chart */}
        <div className="flex-1 p-4 flex flex-col min-h-0 relative bg-slate-900 transition-all duration-500 ease-in-out">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0 pointer-events-none" />
            
            <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-2 shadow-2xl relative z-10 flex flex-col">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={teams} // Using original order so bars don't swap positions
                    margin={{ top: 50, right: 20, left: 10, bottom: 30 }}
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
                        radius={[6, 6, 0, 0]}
                        animationDuration={800}
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

        {/* RIGHT: Controls - Collapsible Sidebar */}
        {!isPresentationMode && (
          <div 
              className="bg-slate-800 border-l border-slate-700 flex flex-col shadow-2xl z-20 w-full lg:w-[380px] overflow-hidden"
          >
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0 whitespace-nowrap">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Bediening</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-900/30 whitespace-nowrap">
              {teams.map((team) => (
                <div 
                  key={team.id} 
                  className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50 flex items-center gap-3 hover:bg-slate-700 transition-colors group"
                  style={{ borderLeft: `4px solid ${team.color}` }}
                >
                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-slate-200 text-sm truncate pr-2">{team.name}</h3>
                          <span className="font-mono font-black text-xl text-white">{team.score}</span>
                      </div>
                      <div className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                          {team.members || "Geen leden"}
                      </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                      <button 
                          onClick={() => updateScore(team.id, -1)}
                          className="w-8 h-8 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 border border-slate-600 rounded flex items-center justify-center transition-all active:scale-95"
                          title="-1 Punt"
                      >
                          <Minus size={14} />
                      </button>
                      <button 
                          onClick={() => updateScore(team.id, 1)}
                          className="h-8 px-3 bg-[#4f86f7] hover:bg-blue-600 text-white font-bold rounded flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm text-sm"
                          title="+1 Punt"
                      >
                          <Plus size={14} />
                          <span>1</span>
                      </button>
                      <button 
                          onClick={() => updateScore(team.id, 5)}
                          className="h-8 px-2 bg-slate-800 hover:bg-emerald-900/30 text-emerald-400 border border-slate-600 hover:border-emerald-700 font-bold rounded flex items-center justify-center transition-all active:scale-95 text-xs"
                          title="+5 Punten"
                      >
                          +5
                      </button>
                  </div>
                </div>
              ))}
            </div>

              {/* Mini Top 3 - Very Compact */}
            <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 shrink-0 whitespace-nowrap">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="uppercase font-bold">Top 3</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                  {sortedLeaderboard.slice(0, 3).map((team, idx) => (
                      <div key={team.id} className="bg-slate-900 rounded p-1.5 border border-slate-700 flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                                  idx === 0 ? 'bg-yellow-500 text-slate-900' : 
                                  idx === 1 ? 'bg-slate-400 text-slate-900' : 'bg-orange-500 text-white'
                              }`}>
                                  {idx + 1}
                              </div>
                          <span className="text-[10px] text-slate-300 truncate w-full text-center font-medium">{team.name}</span>
                          <span className="text-xs font-bold text-white">{team.score}</span>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};