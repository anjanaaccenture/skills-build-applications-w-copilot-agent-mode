import { CapabilityCard } from './CapabilityCard.js';

type LeaderboardResponse = {
  leaderboard: Array<{
    teamName: string;
    totalPoints: number;
    rank: number;
  }>;
};

export default function Leaderboard() {
  return (
    <CapabilityCard
      title="Leaderboard"
      description="Compare team point totals."
      apiPath="/api/leaderboard"
      emptyMessage="No leaderboard data."
      renderContent={(data: unknown) => {
        const { leaderboard } = data as LeaderboardResponse;
        if (leaderboard.length === 0) return <p>No leaderboard</p>;
        return (
          <ol>
            {leaderboard.map((entry, index) => (
              <li key={index}>{entry.teamName} - {entry.totalPoints} points (Rank: {entry.rank})</li>
            ))}
          </ol>
        );
      }}
    />
  );
}
