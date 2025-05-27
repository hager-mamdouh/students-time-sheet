// src/app/core/models/student-timesheet.model.ts
export interface ClassSchedule {
  subject: string;
  day: string;
  startTime: string; // "HH:mm"
  endTime: string;
}

export interface StudentTimesheet {
  studentId: string;
  schedule: ClassSchedule[];
}
