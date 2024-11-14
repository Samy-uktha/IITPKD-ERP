import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private pendingSubmissions: any[] = [];

  addSubmission(submission: any): void {
    this.pendingSubmissions.push(submission);
  }

  getPendingSubmissions(): any[] {
    return this.pendingSubmissions;
  }
  constructor() { }
}
