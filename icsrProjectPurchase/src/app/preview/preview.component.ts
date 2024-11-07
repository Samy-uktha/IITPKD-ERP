import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project, Status } from '../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  @Input() project: Project = {} as Project;

  @Output() Approve = new EventEmitter<boolean>();
  @Output() Reject = new EventEmitter<boolean>();
  @Output() SentBack = new EventEmitter<boolean>();
  @Output() forward = new EventEmitter<boolean>();

  @Output() prev = new EventEmitter<boolean>();

  @Output() comments = new EventEmitter<string>();

  comment : string = "";

  get isApproved() : boolean{
    return (this.project.status.status.toLowerCase() === Status.APPROVED.toLowerCase());
  }

  get isPending() : boolean{
    return (this.project.status.status.toLowerCase() === Status.PENDING.toLowerCase());
  }

  get isSent():boolean{
    return (this.project.status.status === Status.CLARIFICATION);
  }

  approveProposal(){
    this.Approve.emit(true);
    this.comments.emit(this.comment);
  }

  rejectProposal(){
    this.Reject.emit(true);
    this.comments.emit(this.comment);
  }

  sentbackProposal(){
    this.SentBack.emit(true);
    this.comments.emit(this.comment);
  }

  forwardProposal(){
    this.forward.emit(true);
    this.comments.emit(this.comment);
  }

  back(){
    this.prev.emit(false);
  }

}
