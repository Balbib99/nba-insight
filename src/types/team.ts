export type Conference = 'East' | 'West';

export type Division =
  | 'Atlantic'
  | 'Central'
  | 'Southeast'
  | 'Northwest'
  | 'Pacific'
  | 'Southwest';

export interface Team {
  id: string;
  name: string;
  city: string;
  fullName: string;
  abbreviation: string;
  conference: Conference;
  division: Division;
}
