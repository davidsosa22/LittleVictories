export interface Entry {
  id: number;
  user_id: string;
  createdAt: Date;
  content: string;
  date: string;
  updatedAt: Date;
}

export interface Task {
  description: string;
  due_date: Date;
  id: number;
  is_complete: boolean;
  is_important: boolean;
  minutes_to_complete: number;
}

export interface Habit {
  id: number;
  description: string;
  frequency: string;
  days_of_week: string;
  calendar_date: number;
  is_complete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  tasks: Task[];
  habits: Habit[];
  points: number;
  level: number;
  entries: Entry[];
  readable_font: boolean;
  userStats : UserStat[];
}

export type MoodType = 'great' | 'good' | 'ok' | 'bad' | 'terrible';

export interface UserStat {
  id: number;
  sleep_hours: number;
  eaten_well: boolean;
  exercised: boolean;
  notes: string;
  mood: MoodType;
  date: string;
}