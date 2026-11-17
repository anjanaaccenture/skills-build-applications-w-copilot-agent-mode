import { CapabilityCard } from './CapabilityCard.js';

type ActivitiesResponse = {
  activities: Array<{
    type: string;
    minutes: number;
    points: number;
  }>;
};

export default function Activities() {
  return (
    <CapabilityCard
      title="Activities"
      description="Track student activity minutes and points."
      apiPath="/api/activities"
      emptyMessage="No activities recorded."
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
