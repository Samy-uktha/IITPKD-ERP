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
  statusProject = projectStatus;

  pendingProjects: Project[] = [];
  approvedProjects= projectStatus['Accepted'];
  rejectedProjects = projectStatus['Rejected'];

  constructor(private submissionService: SubmissionService){}

  ngOnInit(): void {
    this.activeTab = 0
    this.submissionService.pendingSubmissions$.subscribe(data => {
      console.log("data",data)
      this.pendingProjects = data;
    });
    console.log("pending projects",this.pendingProjects)
    console.log("accepted",this.approvedProjects)
  }

  changeTab(index: number): void {
    this.activeTab = index;
    console.log("index",index)
    console.log("pending",this.pendingProjects,"\napproved",this.approvedProjects,"\nrejected",this.rejectedProjects)
  }

  onSelectProject(project: Project): void {
    const generatePreview = this.activeTab === 0; // Only generate preview for Pending tab
  this.projectSelected.emit({ project, generatePreview });
  }

  @Output() titleSelected = new EventEmitter<string>();
  sendTitleItem(item:string):void{
    this.titleSelected.emit(item);
    console.log(item)
  }

  @Output() projectSelected = new EventEmitter<any>();
  searchQuery: string = '';

  filteredProjects = [...projects]; 
  filterProjects(): void {
    this.filteredProjects = projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Emit selected project details for autofilling
  selectProject(project: any): void {
    const completeProject: Project = {
      ...project,
      equipments: project.equipments || [],   // Add empty or default values
      document: project.document || null,    // Add default document object
      status: project.status || 'PENDING',   // Default to "PENDING" status
    };
  
    const generatePreview = this.activeTab === 0; // Only generate preview for Pending tab
    this.projectSelected.emit({ project: completeProject, generatePreview: false });
  
  }
}
