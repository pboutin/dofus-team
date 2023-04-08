import { useEffect, useState } from 'react';
import { Team } from 'common/types';

const ipcRenderer = window.require("electron").ipcRenderer;

type Hook = [
  Team[],
  {
    upsertTeam: (team: Team | Omit<Team, 'id'>) => void;
    removeTeam: (teamId: string) => void;
    duplicateTeam: (teamId: string) => void;
    reorderTeams: (teamIds: string[]) => void;
  }
];

export default function useTeams(): Hook {
  const [teams, setTeams] = useState<Team[]>([]);

  ipcRenderer.invoke('getTeams').then(setTeams);

  const handleTeamsChange = (event, teams: Team[]) => {
    setTeams(teams);
  };

  useEffect(() => {
    ipcRenderer.on('teamsChanged', handleTeamsChange);

    return () => {
      ipcRenderer.removeListener('teamsChanged', handleTeamsChange);
    };
  });

  return [
    teams,
    {
      upsertTeam: (team: Team) => {
        ipcRenderer.invoke('upsertTeam', team);
      },
      removeTeam: (teamId: string) => {
        ipcRenderer.invoke('removeTeam', teamId);
      },
      duplicateTeam: (teamId: string) => {
        ipcRenderer.invoke('duplicateTeam', teamId);
      },
      reorderTeams: (teamIds: string[]) => {
        ipcRenderer.invoke('reorderTeams', teamIds);
      }
    }
  ];
}
