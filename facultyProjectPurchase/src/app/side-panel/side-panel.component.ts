import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { projects } from '../project-data';
import { projectStatus } from '../purchase-proposal-data';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, NgbNavModule, NgbTypeaheadModule, FormsModule],
  templateUrl: './side-panel.component.html',
})
export class SidePanelComponent {

  activeTab: number = 0;
  statuses = ['Pending', 'Accepted', 'Rejected']; 
  statusProject = projectStatus;
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
