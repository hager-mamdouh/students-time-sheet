import { TestBed } from '@angular/core/testing';
import { ApiTimesheetService } from './api-timesheet.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiTimesheetService', () => {
  let service: ApiTimesheetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiTimesheetService]
    });

    service = TestBed.inject(ApiTimesheetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve timesheet data', () => {
    const mockResponse = {
      "studentId": "1",
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
      ;

    service.getTimesheet('1').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service.baseUrl + 'api/timesheet');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('sessionID')).toBeTruthy();
    req.flush(mockResponse);
  });

  it('should handle error when retrieving timesheet data', () => {
    service.getTimesheet('1').subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(service.baseUrl + 'api/timesheet');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});