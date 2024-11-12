// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
// import { SidePanelComponent } from '../side-panel/side-panel.component';
// import { ProjectCardComponent } from '../project-card/project-card.component';
// import { Project } from '../interfaces';
// import { ViewScreenComponent } from '../view-screen/view-screen.component';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, SidePanelComponent, ProjectCardComponent, ViewScreenComponent],
//   templateUrl: './home.component.html',
// })
// export class HomeComponent implements OnInit, OnDestroy {

//   selectedProject: Project|null=null;
//   projectData: any;
//   equipmentForm: FormGroup;
//   documentForm: FormGroup;
//   showPreview: boolean = false;
//   submissionDate: string='';
//   documentURL: string | null = null;
//   equipmentFileURLs: string[] = [];

//   constructor(private fb: FormBuilder) {
  
//     this.equipmentForm = this.fb.group({
//       equipmentEntries: this.fb.array([]),
//     });

//     this.documentForm = this.fb.group({
//       document: [null],
//     });
    
//   }

//   ngOnInit(): void {
//     this.addEquipmentEntry();
//   }

//   ngOnDestroy(): void {
//     if (this.documentURL){
//       URL.revokeObjectURL(this.documentURL);
//     }
//     this.equipmentFileURLs.forEach(url => URL.revokeObjectURL(url));
//   }

//   handleSelectedItem(item: string) {
//     console.log('Selected item:', item);
//   }

//   handleProjectSelection(projectData: Project | null) {
//     this.selectedProject = projectData; // Assign projectData to pass it to ProjectCardComponent
//   }
    
//   onProjectFormChange(projectData: any): void {
//     this.projectData = projectData;
//   }

//   generatePreview(): void {
//     console.log('Project Data:', this.projectData);
//   console.log('Project Data Validity:', !!this.projectData);
//   console.log('Equipment Form Valid:', this.equipmentForm.valid);
//   console.log('Document Form Valid:', this.documentForm.valid);

//     const equipmentEntriesValid = this.equipmentEntries.controls.every(entry =>
//       entry.get('equipmentName')?.valid && entry.get('equipmentQuantity')?.valid
//     );

//     if (this.projectData && equipmentEntriesValid) {
//       this.submissionDate = new Date().toLocaleDateString();
//       this.showPreview = true;
//     }else(
//       alert("fill all fields")
//     )
//   }
//   exitPreview(): void {
//     this.showPreview = false;
//   }

//   onSubmit(): void {
//     if (
//       this.projectData &&
//       this.equipmentForm.valid &&
//       this.documentForm.valid
//     ) {
//       const projectData = {
//         projectDetails: this.projectData,
//         equipmentDetails: this.equipmentForm.value,
//         document: this.documentForm.value.document,
//       };
//       console.log('Submitted Data:', projectData);
//       console.log('Project Data:', this.projectData);
//   console.log('Project Data Validity:', !!this.projectData);
//   console.log('Equipment Form Valid:', this.equipmentForm.valid);
//   console.log('Document Form Valid:', this.documentForm.valid);



//       // Prepare project details data
//     const projectDetails = {
//       projectName: this.projectData?.projectName || '',
//       projectCategory: this.projectData?.projectCategory || '',
//       projectID: this.projectData?.projectID || '',
//       projectGrant: this.projectData?.projectGrant || '',
//       projectDuration: this.projectData?.projectDuration || '',
//       projectBudget: this.projectData?.projectBudget || '',
//       projectDescription: this.projectData?.projectDescription || '',
//     };

//     // Prepare equipment details data
//     const equipmentDetails = this.equipmentEntries.controls.map(entry => ({
//       equipmentName: entry.get('equipmentName')?.value,
//       equipmentQuantity: entry.get('equipmentQuantity')?.value,
//       equipmentJustification: entry.get('equipmentJustification')?.value,
//       equipmentFileName: entry.get('equipmentFile')?.value?.name || 'No file uploaded',
//       equipmentFileURL: entry.get('equipmentFileURL')?.value,
//     }));

//     // Prepare document data
//     const documentDetails = {
//       documentName: this.documentForm.get('document')?.value?.name || 'No document uploaded',
//       documentURL: this.documentURL
//     };

//     // Combine all data into a single JSON object
//     const data = {
//       projectDetails,
//       equipmentDetails,
//       documentDetails,
//       submissionDate: this.submissionDate
//     };

//       const jsonData = JSON.stringify(data, null, 2);
//       const blob = new Blob([jsonData], { type: 'application/json' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'project_data.json';
//       a.click();
//       window.URL.revokeObjectURL(url);

//       alert('Data has been saved as JSON file.');
//       this.showPreview = false;
//     } 
  
//     } 
  
    
//   sendClickNext(): void {
//     this.onSubmit(); // Optional: if you want to submit before navigating
//   }

//   get equipmentEntries(): FormArray {
//     return this.equipmentForm.get('equipmentEntries') as FormArray;
//   }

//   addEquipmentEntry(): void {
//     const equipmentEntry = this.fb.group({
//       equipmentName: ['', Validators.required],
//       equipmentSpecs: [''],
//       equipmentQuantity: [1, Validators.required],
//       equipmentJustification: [''],
//       equipmentFile:[null],
//       equipmentFileURL: [null]
//     });
//     this.equipmentEntries.push(equipmentEntry);
//   }

//   removeEquipmentEntry(index: number): void {
//     this.equipmentEntries.removeAt(index);
//   }

//   onFileChange(event: any, index: number) {
//     const file = event.target.files[0];
//     // this.equipmentEntries.at(index).get('file')?.setValue(file);

//     const entry = this.equipmentEntries.at(index);
//     entry.get('file')?.setValue(file);
//     const fileURL = URL.createObjectURL(file);
//     if (entry.get('equipmentFileURL')?.value) {
//       URL.revokeObjectURL(entry.get('equipmentFileURL')?.value);
//     }
//     entry.patchValue({equipmentFileURL : fileURL }); // Store the URL in the form

//     // Track the URL for cleanup on component destruction
//     this.equipmentFileURLs.push(fileURL);
//   }

//   onDocumentFileChange(event: any) {
//     const file = event.target.files[0];
//     this.documentForm.get('document')?.setValue(file);
  
//   // If a new file is uploaded, revoke the old URL and create a new one
//   if (this.documentURL) {
//     URL.revokeObjectURL(this.documentURL);
//   }
//   this.documentURL = URL.createObjectURL(file);
//   }
// }






import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, Equipment, Document } from '../interfaces';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { ViewScreenComponent } from '../view-screen/view-screen.component';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, ReactiveFormsModule, SidePanelComponent, ProjectCardComponent, ViewScreenComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedProject: Project | null = null;
  projectData: Project | null = null;
  documentFile: Document | null = null;
  submissionDate: string = new Date().toLocaleDateString();

  equipmentForm: FormGroup;
  documentForm: FormGroup;
  showPreview: boolean = false;
  documentURL: string | null = null;
  equipmentFileURLs: string[] = [];
  fileLinks: { name: string, url: string }[] = [];

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

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
    this.loadData();
  }

  ngOnDestroy(): void {
    this.revokeURLs();
  }

  // Getter for equipment entries (FormArray)
  get equipmentEntries(): FormArray {
    return this.equipmentForm.get('equipmentEntries') as FormArray;
  }

  handleProjectSelection(projectData: Project | null): void {
    this.selectedProject = projectData;
    this.projectData = projectData;
    this.resetForms();
  }

  handleSelectedItem(item: string) {
    console.log('Selected item:', item);
  }

  onProjectFormChange(projectData: any): void {
    this.projectData = projectData;
  }

  resetForms(): void {
    this.equipmentForm.reset();
    this.documentForm.reset();
    this.revokeURLs();
    this.equipmentFileURLs = [];
    this.documentURL = null;
  }

  generatePreview(): void {
    if (this.projectData && this.equipmentForm.valid && this.documentForm.valid) {
      this.submissionDate = new Date().toLocaleDateString();
      this.showPreview = true;
      this.saveData();
    } else {
      alert("Please fill all fields.");
    }
  }

  exitPreview(): void {
    this.showPreview = false;
    // this.saveData();
    // this.loadData();
  }

  onSubmit(): void {
    const projectDetails = { ...this.projectData };
    const equipmentDetails = this.equipmentEntries.controls.map((entry: AbstractControl) => ({
      equipmentName: entry.get('equipmentName')?.value,
      equipmentSpecs: entry.get('equipmentSpecs')?.value,
      equipmentQuantity: entry.get('equipmentQuantity')?.value,
      equipmentJustification: entry.get('equipmentJustification')?.value,
      equipmentFileURL: entry.get('equipmentFileURL')?.value,
    }));

    const documentDetails = {
      documentName: this.documentForm.get('document')?.value?.name || 'No document uploaded',
      documentURL: this.documentURL,
    };

    const data = {
      projectDetails,
      equipmentDetails,
      documentDetails,
      submissionDate: this.submissionDate,
    };

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_data.json';
    a.click();
    URL.revokeObjectURL(url);

    alert('Data has been saved as a JSON file.');
    this.showPreview = false;
  }

  addEquipmentEntry(): void {
    const equipmentEntry = this.fb.group({
      equipmentName: ['', Validators.required],
      equipmentQuantity: [1, Validators.required],
      equipmentSpecs: [''],
      equipmentJustification: [''],
      equipmentFileURL: [null],
    });
    this.equipmentEntries.push(equipmentEntry);
  }

  removeEquipmentEntry(index: number): void {
    this.equipmentEntries.removeAt(index);
  }

  loadData(): void {
    const savedData = localStorage.getItem('previewData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.equipmentForm.patchValue(parsedData.documentDetails || {});
      this.equipmentEntries.clear();
      parsedData.equipmentDetails?.forEach((equipment: any) => {
        this.addEquipmentEntry();
        this.equipmentEntries.at(this.equipmentEntries.length - 1).patchValue({
          equipmentFileURL: equipment.equipmentFileURL
      });
    });

      // Make sure equipmentDetails is an array, otherwise use an empty array
    this.equipmentFileURLs = Array.isArray(parsedData.equipmentDetails) ? parsedData.equipmentDetails.map((entry:any) => entry.equipmentFileURL) : [];
    
    // Handle documentURL safely
    this.documentURL = parsedData.documentDetails?.documentURL || null;
    }
  }

  saveData(): void {
    const formData = this.equipmentForm.value;
    const files = this.fileInput?.nativeElement.files;
    if (files && files.length > 0) {
      formData.files = Array.from(files).map(file => file.name);
    }

    localStorage.setItem('previewData', JSON.stringify(formData));
  }

  restoreFileLinks(files: string[]): void {
    this.fileLinks = files.map(fileName => ({
      name: fileName,
      url: `path_to_your_files/${fileName}`,
    }));
  }

  resetEquipmentEntries(): void {
    this.equipmentEntries.clear();
    this.fileInput.nativeElement.value = '';
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      this.equipmentEntries.at(index).get('equipmentFileURL')?.setValue(fileURL);
    }
  }

  onDocumentFileChange(event: any): void {
    const fileInput = this.fileInput?.nativeElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.documentForm.get('document')?.setValue(file);
  
      // Revoke previous document URL if any
      if (this.documentURL) URL.revokeObjectURL(this.documentURL);
  
      // Create a new URL for the uploaded file
      this.documentURL = URL.createObjectURL(file);
  
      // Store the document object with name and URL
      this.documentFile = {
        documentName: file.name,
        documentURL: this.documentURL,
      };

      console.log('Document URL set:', this.documentURL);
    }
}

private revokeURLs(): void {
  // Revoke all equipment file URLs
  this.equipmentFileURLs.forEach(url => URL.revokeObjectURL(url));
  
  // Revoke the document URL if it exists
  if (this.documentURL) {
    URL.revokeObjectURL(this.documentURL);
  }
}


}



