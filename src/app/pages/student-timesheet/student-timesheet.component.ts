import { Component } from '@angular/core';
import { ClassSchedule } from '../../core/models/student-timesheet.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ApiTimesheetService } from '../../core/services/api-timesheet.service';


@Component({
  selector: 'app-student-timesheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [ApiTimesheetService],
  templateUrl: './student-timesheet.component.html',
  styleUrl: './student-timesheet.component.scss'
})
export class StudentTimesheetComponent {
  studentId!: string;
  schedule!: ClassSchedule[];

  constructor(private timesheetService: ApiTimesheetService) { }

  isCurrentClass(classItem: ClassSchedule): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });


    if (classItem.day !== day) return false;

    const start = this.toMinutes(classItem.startTime);
    const end = this.toMinutes(classItem.endTime);

    return currentMinutes >= start && currentMinutes <= end;
  }

  isNextClass(classItem: ClassSchedule): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    const start = this.toMinutes(classItem.startTime);

    return classItem.day === day && start > currentMinutes;
  }

  toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  loadData() {
    this.timesheetService.getTimesheet(this.studentId).subscribe({
      next: (res) => {
        this.schedule = res.schedule;
      },
      error: (err) => {
        this.schedule = [];
        alert('Failed to load schedule. Please try again.');
        console.error(err);
      }
    });
  }

}
