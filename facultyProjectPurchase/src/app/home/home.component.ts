import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '../interfaces';
import { ViewScreenComponent } from '../view-screen/view-screen.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidePanelComponent, ProjectCardComponent, ViewScreenComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedProject: Project|null=null;
  projectData: any;
  equipmentForm: FormGroup;
  documentForm: FormGroup;
  showPreview: boolean = false;
  submissionDate: string='';
  documentURL: string | null = null;
  equipmentFileURLs: string[] = [];

  constructor(private fb: FormBuilder) {
  
    this.equipmentForm = this.fb.group({
      equipmentEntries: this.fb.array([]),
    });

    this.documentForm = this.fb.group({
      document: [null],
    });
    
  }

  ngOnInit(): void {
    this.addEquipmentEntry();
  }

  ngOnDestroy(): void {
    if (this.documentURL){
      URL.revokeObjectURL(this.documentURL);
    }
    this.equipmentFileURLs.forEach(url => URL.revokeObjectURL(url));
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

  generatePreview(): void {
    console.log('Project Data:', this.projectData);
  console.log('Project Data Validity:', !!this.projectData);
  console.log('Equipment Form Valid:', this.equipmentForm.valid);
  console.log('Document Form Valid:', this.documentForm.valid);

    const equipmentEntriesValid = this.equipmentEntries.controls.every(entry =>
      entry.get('equipmentName')?.valid && entry.get('equipmentQuantity')?.valid
    );

    if (this.projectData && equipmentEntriesValid) {
      this.submissionDate = new Date().toLocaleDateString();
      this.showPreview = true;
    }else(
      alert("fill all fields")
    )
  }
  exitPreview(): void {
    this.showPreview = false;
  }

  onSubmit(): void {
    if (
      this.projectData &&
      this.equipmentForm.valid &&
      this.documentForm.valid
    ) {
      const projectData = {
        projectDetails: this.projectData,
        equipmentDetails: this.equipmentForm.value,
        document: this.documentForm.value.document,
      };
      console.log('Submitted Data:', projectData);
      console.log('Project Data:', this.projectData);
  console.log('Project Data Validity:', !!this.projectData);
  console.log('Equipment Form Valid:', this.equipmentForm.valid);
  console.log('Document Form Valid:', this.documentForm.valid);



      // Prepare project details data
    const projectDetails = {
      projectName: this.projectData?.projectName || '',
      projectCategory: this.projectData?.projectCategory || '',
      projectID: this.projectData?.projectID || '',
      projectGrant: this.projectData?.projectGrant || '',
      projectDuration: this.projectData?.projectDuration || '',
      projectBudget: this.projectData?.projectBudget || '',
      projectDescription: this.projectData?.projectDescription || '',
    };

    // Prepare equipment details data
    const equipmentDetails = this.equipmentEntries.controls.map(entry => ({
      equipmentName: entry.get('equipmentName')?.value,
      equipmentQuantity: entry.get('equipmentQuantity')?.value,
      equipmentJustification: entry.get('equipmentJustification')?.value,
      equipmentFileName: entry.get('equipmentFile')?.value?.name || 'No file uploaded',
      equipmentFileURL: entry.get('equipmentFileURL')?.value,
    }));

    // Prepare document data
    const documentDetails = {
      documentName: this.documentForm.get('document')?.value?.name || 'No document uploaded',
      documentURL: this.documentURL
    };

    // Combine all data into a single JSON object
    const data = {
      projectDetails,
      equipmentDetails,
      documentDetails,
      submissionDate: this.submissionDate
    };

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project_data.json';
      a.click();
      window.URL.revokeObjectURL(url);

      alert('Data has been saved as JSON file.');
      this.showPreview = false;
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
      equipmentSpecs: [''],
      equipmentQuantity: [1, Validators.required],
      equipmentJustification: [''],
      equipmentFile:[null],
      equipmentFileURL: [null]
    });
    this.equipmentEntries.push(equipmentEntry);
  }

  removeEquipmentEntry(index: number): void {
    this.equipmentEntries.removeAt(index);
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    // this.equipmentEntries.at(index).get('file')?.setValue(file);

    const entry = this.equipmentEntries.at(index);
    entry.get('file')?.setValue(file);
    const fileURL = URL.createObjectURL(file);
    if (entry.get('equipmentFileURL')?.value) {
      URL.revokeObjectURL(entry.get('equipmentFileURL')?.value);
    }
    entry.patchValue({equipmentFileURL : fileURL }); // Store the URL in the form

    // Track the URL for cleanup on component destruction
    this.equipmentFileURLs.push(fileURL);
  }

  onDocumentFileChange(event: any) {
    const file = event.target.files[0];
    this.documentForm.get('document')?.setValue(file);
  
  // If a new file is uploaded, revoke the old URL and create a new one
  if (this.documentURL) {
    URL.revokeObjectURL(this.documentURL);
  }
  this.documentURL = URL.createObjectURL(file);
  }
}
