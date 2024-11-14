import { Injectable } from '@angular/core';
import { projectStatus } from './purchase-proposal-data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private pendingSubmissions: any[] = [];

  addSubmission(submission: any): void {
    this.pendingSubmissions.push(submission);
    if (submission.projectDetails && submission.projectDetails.projectTitle) {
      projectStatus['Pending'].push(submission.projectDetails.projectTitle);
    }
  }

  getPendingSubmissions(): any[] {
    return this.pendingSubmissions;
  }
  constructor() { }
}
