import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type ActivitiesResponse = {
  activities: Array<{
    type: string;
    minutes: number;
    points: number;
  }>;
};

export default function Activities() {
  const fetchData = useCallback(() => getJson<ActivitiesResponse>('/api/activities'), []);

  return (
    <CapabilityCard
      title="Activities"
      description="Track student activity minutes and points."
      emptyMessage="No activities recorded."
      fetchData={fetchData}
      renderContent={(data: unknown) => {
        const { activities } = data as ActivitiesResponse;
        if (activities.length === 0) return <p>No activities</p>;
        return (
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>{activity.type} - {activity.minutes} minutes ({activity.points} points)</li>
            ))}
          </ul>
        );
      }}
    />
  );
}
