export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  teamId: string;
  teamName: string;
  position: PlayerPosition;
  height: string;
  weight: string;
  country: string;
  age: number;
}
