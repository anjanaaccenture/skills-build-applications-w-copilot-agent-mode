import { CapabilityCard } from './CapabilityCard.js';

type TeamsResponse = {
  teams: Array<{
    name: string;
    members: string[];
  }>;
};

export default function Teams() {
  return (
    <CapabilityCard
      title="Teams"
      description="Manage teams and members."
      apiPath="/api/teams"
      emptyMessage="No teams."
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
