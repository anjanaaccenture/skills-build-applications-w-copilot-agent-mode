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

export async function createTeam(_input: unknown) {
  throw Object.assign(new Error('Team validation is not implemented yet'), { status: 501 });
}

export async function getLeaderboard() {
  return [];
}

export async function suggestWorkouts(_userEmail: string) {
  return Workout.find().limit(1).lean();
}

export { User };
