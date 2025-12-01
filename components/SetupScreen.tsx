import React, { useState } from 'react';
import { Plus, Trash2, Users, Play } from 'lucide-react';
import { Team, COLORS } from '../types';

interface SetupScreenProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onStart: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ teams, setTeams, onStart }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState('');

  const addTeam = () => {
    if (!newTeamName.trim()) return;

    const colorIndex = teams.length % COLORS.length;
    
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: newTeamName.trim(),
      members: newTeamMembers.trim(),
      score: 0,
      color: COLORS[colorIndex],
    };

    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setNewTeamMembers('');
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter((t) => t.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTeam();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-10 mt-4">
          <h1 className="text-5xl md:text-7xl font-display text-[#4f86f7] mb-4 drop-shadow-lg tracking-wide">
            Scorebord Live
          </h1>
          <p className="text-slate-400 text-lg">Maak teams aan, deel punten uit en bekijk de live tussenstand.</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="block text-sm font-bold text-slate-400 mb-1">Team Naam</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Bijv. De Vuurvliegjes"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#4f86f7] focus:border-transparent outline-none transition-all shadow-inner"
              />
            </div>
            <div className="md:col-span-6">
              <label className="block text-sm font-bold text-slate-400 mb-1">Leerlingen (namen)</label>
              <input
                type="text"
                value={newTeamMembers}
                onChange={(e) => setNewTeamMembers(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Bijv. Emma, Noah, Liam..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-[#4f86f7] focus:border-transparent outline-none transition-all shadow-inner"
              />
            </div>
            <div className="md:col-span-2">
              <button
                onClick={addTeam}
                disabled={!newTeamName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#4f86f7] hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg"
              >
                <Plus size={20} />
                <span>Voeg toe</span>
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[200px]">
          {teams.length === 0 ? (
            <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-xl">
              <Users size={48} className="mx-auto mb-4 opacity-50 text-slate-600" />
              <p>Nog geen teams. Voeg er hierboven een toe!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center shadow-lg hover:bg-slate-750 transition-colors"
                  style={{ borderLeft: `6px solid ${team.color}` }}
                >
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">{team.name}</h3>
                    <p className="text-sm text-slate-400 truncate max-w-[250px]">{team.members || "Geen leden"}</p>
                  </div>
                  <button
                    onClick={() => removeTeam(team.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors"
                    title="Team verwijderen"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer for Start Button */}
      <div className="shrink-0 p-6 border-t border-slate-800 bg-slate-900 flex flex-col items-center justify-center z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        <button
          onClick={onStart}
          disabled={teams.length < 2}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg shadow-emerald-900/20 transform transition-all hover:scale-105 active:scale-95"
        >
          <Play fill="currentColor" />
          <span>Start Scorebord</span>
        </button>
        {teams.length < 2 && teams.length > 0 && (
           <p className="text-orange-400/80 mt-3 text-sm font-medium">Je hebt minimaal 2 teams nodig om te starten.</p>
        )}
      </div>
    </div>
  );
};