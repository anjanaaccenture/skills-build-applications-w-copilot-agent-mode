import { Activity, Team, User, Workout } from '../models/index.js';
import mongoose from 'mongoose';

function computePoints(type: string): number {
  const pointsMap: Record<string, number> = {
    walk: 10,
    run: 40,
    cycle: 25,
    swim: 35,
  };
  return pointsMap[type] ?? 10;
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!input || typeof input !== 'object') {
    throw Object.assign(new Error('Activity input must be an object'), { status: 400 });
  }

  const { userId, teamId, type, minutes } = input as Record<string, unknown>;

  if (!userId || !teamId || !type || minutes === undefined || minutes === null) {
    throw Object.assign(new Error('Missing required fields: userId, teamId, type, minutes'), { status: 400 });
  }

  if (typeof userId !== 'string' || typeof teamId !== 'string' || typeof type !== 'string' || typeof minutes !== 'number') {
    throw Object.assign(new Error('Invalid field types'), { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw Object.assign(new Error('Invalid userId format'), { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    throw Object.assign(new Error('Invalid teamId format'), { status: 400 });
  }

  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 400 });
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw Object.assign(new Error('Team not found'), { status: 400 });
  }

  const activity = await Activity.create({
    user: userId,
    team: teamId,
    type,
    minutes,
    points: computePoints(type),
    occurredAt: new Date(),
  });

  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!input || typeof input !== 'object') {
    throw Object.assign(new Error('Team input must be an object'), { status: 400 });
  }

  const { name, mascot, members } = input as Record<string, unknown>;

  if (!name) {
    throw Object.assign(new Error('Missing required field: name'), { status: 400 });
  }

  if (typeof name !== 'string') {
    throw Object.assign(new Error('Field name must be a string'), { status: 400 });
  }

  const team = await Team.create({
    name,
    mascot: mascot || '',
    members: Array.isArray(members) ? members : [],
  });

  return team.toObject();
}

export async function getLeaderboard() {
  const pipeline = [
    {
      $group: {
        _id: '$team',
        totalPoints: { $sum: '$points' },
      },
    },
    {
      $lookup: {
        from: 'teams',
        localField: '_id',
        foreignField: '_id',
        as: 'teamData',
      },
    },
    {
      $unwind: '$teamData',
    },
    {
      $sort: { totalPoints: -1 },
    },
    {
      $project: {
        _id: 0,
        teamName: '$teamData.name',
        totalPoints: 1,
      },
    },
  ];

  const results = await Activity.aggregate(pipeline);

  return results.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }

  const recentActivities = await Activity.find({ user: user._id })
    .sort({ occurredAt: -1 })
    .limit(5);

  const activityTypes = recentActivities.map((a) => a.type);
  const primaryActivityType = activityTypes[0];

  let focusCriteria: string | undefined;
  let reason = '';

  if (primaryActivityType === 'run' || user.fitnessGoal === 'endurance') {
    focusCriteria = 'endurance';
    reason = primaryActivityType === 'run' ? 'Based on your recent running activity' : 'Matches your endurance goal';
  } else if (primaryActivityType === 'strength' || user.fitnessGoal === 'strength') {
    focusCriteria = 'strength';
    reason = primaryActivityType === 'strength' ? 'Based on your recent strength activity' : 'Matches your strength goal';
  } else if (primaryActivityType === 'cycle') {
    focusCriteria = 'endurance';
    reason = 'Complements your cycling activity';
  } else {
    focusCriteria = user.fitnessGoal;
    reason = `Matches your ${user.fitnessGoal} goal`;
  }

  const workouts = await Workout.find({ focus: focusCriteria }).limit(1).lean();

  if (workouts.length === 0) {
    const anyWorkout = await Workout.findOne().lean();
    if (!anyWorkout) {
      throw Object.assign(new Error('No workouts available'), { status: 500 });
    }
    return [{ ...anyWorkout, reason: 'Available workout' }];
  }

  return workouts.map((w) => ({ ...w, reason }));
}

export { User };
