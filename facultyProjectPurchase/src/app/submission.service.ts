import { Injectable } from '@angular/core';
import { projectStatus } from './purchase-proposal-data';
import { BehaviorSubject } from 'rxjs';
import { Project, ProjectStatus } from './interfaces';

@Injectable({
  providedIn: 'root'
})
// export class SubmissionService {
//   private pendingSubmissions: any[] = [];

//   addSubmission(submission: any): void {
//     this.pendingSubmissions.push(submission);
//     if (submission.projectDetails && submission.projectDetails.projectTitle) {
//       projectStatus['Pending'].push(submission.projectDetails.projectTitle);
//     }
//   }

//   getPendingSubmissions(): any[] {
//     return this.pendingSubmissions;
//   }
//   constructor() { }
// }


// export class SubmissionService {
//   private pendingSubmissions = new BehaviorSubject<Project[]>([]);
//   pendingSubmissions$ = this.pendingSubmissions.asObservable();

//   addSubmission(submission: Project): void {
//     const currentSubmissions = this.pendingSubmissions.getValue();
//     this.pendingSubmissions.next([...currentSubmissions, submission]);
//   }

//   getPendingSubmissions(): Project[] {
//     return this.pendingSubmissions.getValue();
//   }
// }

export class SubmissionService {
  private pendingSubmissions = new BehaviorSubject<Project[]>([]);
  private approvedSubmissions = new BehaviorSubject<Project[]>([]);
  private rejectedSubmissions = new BehaviorSubject<Project[]>([]);

  get pendingSubmissions$() {
    return this.pendingSubmissions.asObservable();
  }

  get approvedSubmissions$() {
    return this.approvedSubmissions.asObservable();
  }

  get rejectedSubmissions$() {
    return this.rejectedSubmissions.asObservable();
  }

  addSubmission(submission: Project) {
    if (submission.status === ProjectStatus.PENDING) {
      console.log("adding submission", submission);
      const current = this.pendingSubmissions.getValue();
      this.pendingSubmissions.next([...current, submission]);

    } else if (submission.status === ProjectStatus.APPROVED) {
      const current = this.approvedSubmissions.getValue();
      this.approvedSubmissions.next([...current, submission]);
    } else if (submission.status === ProjectStatus.REJECTED) {
      const current = this.rejectedSubmissions.getValue();
      this.rejectedSubmissions.next([...current, submission]);
    }
  }
}
