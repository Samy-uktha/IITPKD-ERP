import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';
import { Project } from '../interfaces';

@Component({
  selector: 'app-view-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-screen.component.html',
})
export class ViewScreenComponent {
  @Input() projectData: any;
  @Input() equipmentEntries!: FormArray;
  @Input() documentFile: any;
  @Input() submissionDate!: string;
  private _documentURL: string | null = null;

  get documentURL() {
    return this.documentFile ? URL.createObjectURL(this.documentFile) : null;
  }

  isProjectDataType(projectData: any): boolean {
    return projectData && 
           typeof projectData.projectName === 'string' && 
           typeof projectData.projectID === 'string' &&
           typeof projectData.projectCategory === 'string' &&
           typeof projectData.projectDuration === 'string' &&
           typeof projectData.projectBudget === 'string' &&
           typeof projectData.projectGrant === 'string' &&
           typeof projectData.projectDescription === 'string';
  }
  }

