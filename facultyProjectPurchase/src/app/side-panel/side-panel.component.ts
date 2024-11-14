import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { projects } from '../project-data';
import { projectStatus } from '../purchase-proposal-data';
import { Project, ProjectStatus } from '../interfaces';
import { SubmissionService } from '../submission.service';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, NgbNavModule, NgbTypeaheadModule, FormsModule],
  templateUrl: './side-panel.component.html',
})
export class SidePanelComponent implements OnInit{
  activeTab: number = 0;
  statuses: string[] = ['Pending', 'Accepted', 'Rejected']; 
  // statusProject = projectStatus;
  // statusProject: { [key: string]: string[] } = {
  //   'Pending': [],
  //   'Accepted': [],
  //   'Rejected': []
  // };
  statusProject = projectStatus;

  pendingProjects: Project[] = [];
  approvedProjects= projectStatus['Accepted'];
  rejectedProjects = projectStatus['Rejected'];
  // pendingSubmission: any[] = [];

  constructor(private submissionService: SubmissionService){}

  ngOnInit(): void {
    this.activeTab = 0
    // this.updatePendingProjects();
    this.submissionService.pendingSubmissions$.subscribe(data => {
      console.log("data",data)
      this.pendingProjects = data;
    });
    console.log("pending projects",this.pendingProjects)
    console.log("accepted",this.approvedProjects)
    // this.submissionService.approvedSubmissions$.subscribe(data => {
    //   this.approvedProjects = data;
    // });
    // this.submissionService.rejectedSubmissions$.subscribe(data => {
    //   this.rejectedProjects = data;
    // });

  }

  changeTab(index: number): void {
    this.activeTab = index;
    console.log("index",index)
    console.log("pending",this.pendingProjects,"\napproved",this.approvedProjects,"\nrejected",this.rejectedProjects)
  }

  // updatePendingProjects(): void {
  //   const pendingSubmissions = this.submissionService.getPendingSubmissions();
  //   this.statusProject['Pending'] = [
  //     ...pendingSubmissions.map((submission: Project) => submission.name),
  //     ...projectStatus['Pending']
  //   ];
  // }

  onSelectProject(project: any): void {
    this.projectSelected.emit(project);
    // Logic to display project details in preview when clicked
  }

  

  // @Input() pendingProjects: Project[] = [];
  @Output() titleSelected = new EventEmitter<string>();
  sendTitleItem(item:string):void{
    this.titleSelected.emit(item);
    console.log(item)
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
