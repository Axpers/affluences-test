export interface TimeTablesResult {
  open: boolean;
  timetables: timetableState[];
}

export interface timetableState {
  opening: string;
  closing: string;
}
