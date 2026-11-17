import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type WorkoutsResponse = {
  suggestions: Array<{
    title: string;
    reason: string;
  }>;
};

export default function Workouts() {
  const fetchData = useCallback(() => getJson<WorkoutsResponse>('/api/workouts/suggestions/mona@example.com'), []);

  return (
    <CapabilityCard
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      emptyMessage="No workout suggestions."
      fetchData={fetchData}
      renderContent={(data: unknown) => {
        const { suggestions } = data as WorkoutsResponse;
        if (suggestions.length === 0) return <p>No workout suggestions</p>;
        return (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion.title} - {suggestion.reason}</li>
            ))}
          </ul>
        );
      }}
    />
  );
}
