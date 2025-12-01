export interface Team {
  id: string;
  name: string;
  members: string; // Stored as a string for display, or can be parsed
  score: number;
  color: string;
}

export type ViewState = 'setup' | 'live';

export const COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
];