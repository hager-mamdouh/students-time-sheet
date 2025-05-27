import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'student',
        loadComponent: () => import('./pages/student-timesheet/student-timesheet.component').then(m => m.StudentTimesheetComponent)
    },
    {
        path: '',
        redirectTo: 'student',
        pathMatch: 'full'
    },
];
