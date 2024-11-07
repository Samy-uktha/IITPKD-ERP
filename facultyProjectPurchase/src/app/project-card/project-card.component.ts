import { Component, EventEmitter, Output, Input, SimpleChanges, OnChanges} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../interfaces';
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './project-card.component.html',

})
export class ProjectCardComponent implements OnChanges{
  @Input() project: Project |null =null;
  @Output() projectFormChange = new EventEmitter<any>();
  
  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectCategory: ['', Validators.required],
      projectID: ['', Validators.required],
      projectGrant: ['', Validators.required],
      projectDuration: ['', Validators.required],
      projectBudget: ['', Validators.required],
      projectDescription: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] ) {
      if (this.project) {
        this.autofillProjectDetails(this.project);
      }else{
      this.resetForm();
    }
  }
  }

  autofillProjectDetails(project: Project): void {
    this.projectForm.patchValue({
      projectName: project.name,
      projectCategory: project.category,
      projectDuration: project.duration,
      projectBudget: project.budget,
      projectGrant: project.grant,
      projectID: project.id,
      projectDescription: project.description
    });
  }

  resetForm(): void {
    this.projectForm.patchValue({
      projectName: '',
      projectCategory: '',
      projectDuration: '',
      projectBudget: '',
      projectGrant: '',
      projectID: '',
      projectDescription: ''
    });
  }

  onProjectFormChange(): void {
    this.projectFormChange.emit(this.projectForm.value);
  }
}