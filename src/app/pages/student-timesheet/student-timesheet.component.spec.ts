import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTimesheetComponent } from './student-timesheet.component';
import { ApiTimesheetService } from '../../core/services/api-timesheet.service';
import { of, throwError } from 'rxjs';
import { ClassSchedule, StudentTimesheet } from '../../core/models/student-timesheet.model';

describe('StudentTimesheetComponent', () => {
  let component: StudentTimesheetComponent;
  let fixture: ComponentFixture<StudentTimesheetComponent>;
  let mockApiTimesheetService: jasmine.SpyObj<ApiTimesheetService>;

  beforeEach(async () => {
    mockApiTimesheetService = jasmine.createSpyObj('ApiTimesheetService', ['getTimesheet']);

    await TestBed.configureTestingModule({
      imports: [StudentTimesheetComponent],
      providers: [{ provide: ApiTimesheetService, useValue: mockApiTimesheetService }]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentTimesheetComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('toMinutes', () => {
    it('should convert time string to minutes', () => {
      expect(component.toMinutes('02:30')).toBe(150);
      expect(component.toMinutes('00:00')).toBe(0);
    });
  });

  describe('isCurrentClass', () => {
    it('should return true if the class is currently ongoing', () => {
      const now = new Date();
      const classItem: ClassSchedule = {
        subject: 'Math',
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        startTime: '00:00',
        endTime: '23:59'
      };
      expect(component.isCurrentClass(classItem)).toBeTrue();
    });

    it('should return false if the class is not ongoing', () => {
      const now = new Date();
      const classItem: ClassSchedule = {
        subject: 'Math',
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        startTime: '23:00',
        endTime: '23:59'
      };
      expect(component.isCurrentClass(classItem)).toBeFalse();
    });
  });

  describe('isNextClass', () => {
    it('should return true if the class is the next one', () => {
      const now = new Date();
      const classItem: ClassSchedule = {
        subject: 'Math',
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        startTime: '23:59',
        endTime: '23:59'
      };
      expect(component.isNextClass(classItem)).toBeTrue();
    });

    it('should return false if the class is not the next one', () => {
      const now = new Date();
      const classItem: ClassSchedule = {
        subject: 'Math',
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        startTime: '00:00',
        endTime: '23:59'
      };
      expect(component.isNextClass(classItem)).toBeFalse();
    });
  });

  describe('loadData', () => {
    it('should load schedule data on success', () => {
      const mockSchedule: StudentTimesheet = {
        "studentId": '1',
        "schedule": [
          {
            "subject": "Mathematics",
            "day": "Monday",
            "startTime": "09:00",
            "endTime": "10:30"
          },
          {
            "subject": "Physics",
            "day": "Monday",
            "startTime": "11:00",
            "endTime": "12:30"
          },
          {
            "subject": "Chemistry",
            "day": "Tuesday",
            "startTime": "10:00",
            "endTime": "11:30"
          }
        ]
      }

      mockApiTimesheetService.getTimesheet.and.returnValue(of(mockSchedule));

      component.studentId = '1';
      component.loadData();

      expect(component.schedule).toEqual(mockSchedule.schedule);
    });

    it('should handle error when loading schedule data', () => {
      mockApiTimesheetService.getTimesheet.and.returnValue(throwError(() => new Error('API error')));

      spyOn(window, 'alert');
      component.studentId = '1';
      component.loadData();

      expect(component.schedule).toEqual([]);
      expect(window.alert).toHaveBeenCalledWith('Failed to load schedule. Please try again.');
    });
  });
});