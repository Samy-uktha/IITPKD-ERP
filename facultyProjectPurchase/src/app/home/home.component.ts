import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '../interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidePanelComponent, ProjectCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  selectedProject: Project|null=null;
  projectData: any;
  equipmentForm: FormGroup;
  purchaseForm: FormGroup;
  documentForm: FormGroup;

  constructor(private fb: FormBuilder) {
  
    this.equipmentForm = this.fb.group({
      equipmentEntries: this.fb.array([]),
    });

    this.purchaseForm = this.fb.group({
      vendor: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      totalCost: ['', [Validators.required, Validators.min(0)]],
    });

    this.documentForm = this.fb.group({
      document: [null, Validators.required],
    });
    
  }

  ngOnInit(): void {
    this.addEquipmentEntry();
  }

  handleSelectedItem(item: string) {
    console.log('Selected item:', item);
  }

  handleProjectSelection(projectData: Project | null) {
    this.selectedProject = projectData; // Assign projectData to pass it to ProjectCardComponent
  }
    
  onProjectFormChange(projectData: any): void {
    this.projectData = projectData;
  }

  onSubmit(): void {
    if (
      this.projectData &&
      this.equipmentForm.valid &&
      this.purchaseForm.valid &&
      this.documentForm.valid
    ) {
      const projectData = {
        projectDetails: this.projectData,
        equipmentDetails: this.equipmentForm.value,
        purchaseDetails: this.purchaseForm.value,
        document: this.documentForm.value.document,
      };
      console.log('Submitted Data:', projectData);
    }
  }
    
  sendClickNext(): void {
    this.onSubmit(); // Optional: if you want to submit before navigating
  }

  get equipmentEntries(): FormArray {
    return this.equipmentForm.get('equipmentEntries') as FormArray;
  }

  addEquipmentEntry(): void {
    const equipmentEntry = this.fb.group({
      equipmentName: ['', Validators.required],
      equipmentSpecs: ['', Validators.required],
      quantity: [1, Validators.required],
      justification: ['', Validators.required],
      file:[null]
    });
    this.equipmentEntries.push(equipmentEntry);
  }

  removeEquipmentEntry(index: number): void {
    this.equipmentEntries.removeAt(index);
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.equipmentEntries.at(index).get('file')?.setValue(file);
  }
}