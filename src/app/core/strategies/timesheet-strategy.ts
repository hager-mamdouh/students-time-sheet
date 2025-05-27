// src/app/core/strategies/timesheet-strategy.ts
import { Observable } from 'rxjs';
import { StudentTimesheet } from '../models/student-timesheet.model';

export interface TimesheetStrategy {
  getTimesheet(studentId: string): Observable<StudentTimesheet>;
}
