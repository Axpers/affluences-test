export interface TimeTablesResult {
  open: boolean;
  timetables: TimetableState[];
}

export interface TimetableState {
  opening: string;
  closing: string;
}
