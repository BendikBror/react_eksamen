export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Booking {
  _id: string;
  player: string;
  court: string;
  players: number;
  date: string;
  time: string;
  medPlayers: string[];
}

export type NewBooking = Omit<Booking, "_id">;
export type UpdateBooking = Partial<Omit<Booking, "_id" | "player">>;