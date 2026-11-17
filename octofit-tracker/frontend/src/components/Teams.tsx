import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type TeamsResponse = {
  teams: Array<{
    name: string;
    members: string[];
  }>;
};

export default function Teams() {
  const fetchData = useCallback(() => getJson<TeamsResponse>('/api/teams'), []);

  return (
    <CapabilityCard
      title="Teams"
      description="Manage teams and members."
      emptyMessage="No teams."
      fetchData={fetchData}
      renderContent={(data: unknown) => {
        const { teams } = data as TeamsResponse;
        if (teams.length === 0) return <p>No teams</p>;
        return (
          <ul>
            {teams.map((team, index) => (
              <li key={index}>{team.name} ({team.members.join(', ')})</li>
            ))}
          </ul>
        );
      }}
    />
  );
}
