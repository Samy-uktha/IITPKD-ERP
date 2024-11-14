import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { projects } from '../project-data';
import { projectStatus } from '../purchase-proposal-data';
import { Project } from '../interfaces';
import { SubmissionService } from '../submission.service';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, NgbNavModule, NgbTypeaheadModule, FormsModule],
  templateUrl: './side-panel.component.html',
})
export class SidePanelComponent implements OnInit{
  pendingSubmission: any[] = [];

  constructor(private submissionService: SubmissionService){}

  ngOnInit(): void {
    this.pendingSubmission = this.submissionService.getPendingSubmissions();
  }

  onSelectProject(project: any): void {
    // Logic to display project details in preview when clicked
  }

  activeTab: number = 0;
  statuses = ['Pending', 'Accepted', 'Rejected']; 
  statusProject = projectStatus;

  // @Input() pendingProjects: Project[] = [];
  @Output() titleSelected = new EventEmitter<string>();
  sendTitleItem(item:string):void{
    this.titleSelected.emit(item);
  }

  @Output() projectSelected = new EventEmitter<any>();
  searchQuery: string = '';

  filteredProjects = [...projects]; // Copy of projects for filtering
  filterProjects(): void {
    this.filteredProjects = projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Emit selected project details for autofilling
  selectProject(project: any): void {
    this.projectSelected.emit(project);
  }
}
