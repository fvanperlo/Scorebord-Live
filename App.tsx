import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { LiveScreen } from './components/LiveScreen';
import { Team, ViewState } from './types';

function App() {
  const [view, setView] = useState<ViewState>('setup');
  const [teams, setTeams] = useState<Team[]>([]);

  return (
    <div className="h-full w-full">
      {view === 'setup' ? (
        <SetupScreen 
            teams={teams} 
            setTeams={setTeams} 
            onStart={() => setView('live')} 
        />
      ) : (
        <LiveScreen 
            teams={teams} 
            setTeams={setTeams} 
            onBack={() => setView('setup')} 
        />
      )}
    </div>
  );
}

export default App;