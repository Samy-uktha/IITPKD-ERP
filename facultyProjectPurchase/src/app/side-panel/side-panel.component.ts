import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, NgbNavModule, NgbTypeaheadModule, FormsModule],
  templateUrl: './side-panel.component.html',
})
export class SidePanelComponent {

  activeTab: number = 0;
  statuses = ['Pending', 'Accepted', 'Rejected']; 
  statusProject : Record<string, string[]>={
    Pending: ['Project 1', 'Project 2'],
    Accepted: ['Project 3', 'Project 4'],
    Rejected: ['Project 5', 'Project 6']
  };
  @Output() titleSelected = new EventEmitter<string>();
  sendTitleItem(item:string):void{
    this.titleSelected.emit(item);
  }

  @Output() projectSelected = new EventEmitter<any>();
  searchQuery: string = '';
  projects = [
    { id: 1, name: 'Project Alpha', category: 'Research', duration: '2023-01-01', budget: 20000, grant: 'GR123' },
    { id: 2, name: 'Project Beta', category: 'Development', duration: '2023-02-01', budget: 30000, grant: 'GR456' },
    // Add more projects as needed
  ];
  filteredProjects = [...this.projects]; // Copy of projects for filtering
  filterProjects(): void {
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Emit selected project details for autofilling
  selectProject(project: any): void {
    this.projectSelected.emit(project);
  }
}
