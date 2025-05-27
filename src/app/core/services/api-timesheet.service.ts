import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StudentTimesheet } from "../models/student-timesheet.model";
import { TimesheetStrategy } from "../strategies/timesheet-strategy";

// src/app/core/services/api-timesheet.service.ts
@Injectable({ providedIn: 'root' })
export class ApiTimesheetService implements TimesheetStrategy {
  baseUrl = 'https://3c007216-759d-4035-85b0-d2677b357e98.mock.pstmn.io'; // Update with postman URL
  // baseUrl = "http://localhost:3000"; // Update with node server URL
  constructor(private http: HttpClient) { }

  getTimesheet(studentId: string): Observable<StudentTimesheet> {
    const headers = new HttpHeaders({
      sessionID: btoa(new Date().toISOString() + studentId)
    });

    return this.http.post<StudentTimesheet>(
      this.baseUrl + '/api/timesheet',
      { studentId: studentId },
      { headers }
    );
  }
}
