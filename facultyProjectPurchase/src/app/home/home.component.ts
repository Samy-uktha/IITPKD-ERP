
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, Equipment, Document } from '../interfaces';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { ViewScreenComponent } from '../view-screen/view-screen.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { SubmissionService } from '../submission.service';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, ReactiveFormsModule, SidePanelComponent, ProjectCardComponent, ViewScreenComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedProject: Project | null = null;
  projectData: Project | null = null;
  documentFile: File | null = null;
  submissionDate: string = new Date().toLocaleDateString();

  equipmentForm: FormGroup;
  documentForm: FormGroup;
  showPreview: boolean = false;
  
  documentURL: string | null = null;
  equipmentFileURLs: string[] = [];
  fileLinks: { name: string, url: string }[] = [];

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private submissionService: SubmissionService) {
    this.equipmentForm = this.fb.group({
      equipmentEntries: this.fb.array([]),
    });

    this.documentForm = this.fb.group({
      documentURL: ['']
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

  handleProjectSelection(projectData: Project): void {
    this.selectedProject = projectData;
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
    this.equipmentForm.reset();
    this.documentForm.reset();

    // Clear form array entries
    this.equipmentEntries.clear();
    this.ensureOneEquipmentEntry();

    // Clear other data variables
    this.selectedProject = null;
    this.projectData = null;
    this.documentFile = null;
    this.submissionDate = new Date().toLocaleDateString();

    
  }

  onSubmit(): void {
    const projectDetails = { ...this.projectData };
    const equipmentDetails = this.equipmentEntries.controls.map((entry: AbstractControl) => ({
      equipmentName: entry.get('equipmentName')?.value,
      equipmentSpecs: entry.get('equipmentSpecs')?.value,
      equipmentQuantity: entry.get('equipmentQuantity')?.value,
      equipmentJustification: entry.get('equipmentJustification')?.value,
      // equipmentFileURL: entry.get('equipmentFileURL')?.value,
      file : entry.get('file')?.value,
    }));

    const documentFile = this.documentForm.get('document')?.value;
    const documentDetails = {
      documentName : this.documentForm.get('document')?.value?.name || "no document uplaoded",
      documentURL : this.documentURL
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
    this.submissionService.addSubmission(data);
    this.showPreview = false;
    this.resetForms();
  }

  addEquipmentEntry(): void {
    const equipmentEntry = this.fb.group({
      equipmentName: ['', Validators.required],
      equipmentQuantity: [1, Validators.required],
      equipmentSpecs: [''],
      equipmentJustification: [''],
      file: this.fb.group({
        documentName: [''],
        documentURL: ['']
      })
    });
    this.equipmentEntries.push(equipmentEntry);
  }
  

  removeEquipmentEntry(index: number): void {
    this.equipmentEntries.removeAt(index);
  }

  ensureOneEquipmentEntry(): void {
    if (this.equipmentEntries.length === 0) {
      this.addEquipmentEntry();
    }
  }

  

  loadData(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
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
  
        this.equipmentFileURLs = Array.isArray(parsedData.equipmentDetails) ? 
          parsedData.equipmentDetails.map((entry: any) => entry.equipmentFileURL) : [];
        this.documentURL = parsedData.documentDetails?.documentURL || null;
      }
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

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      this.equipmentEntries.at(index).get('equipmentFileURL')?.setValue(fileURL);
      this.equipmentEntries.at(index).get('equipmentFile')?.setValue(file);
    }
  }

  // onDocumentFileChange(event: any): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     this.documentFile = input.files[0]; 
  //   }
  // }

  private revokeURLs(): void {
    this.equipmentFileURLs.forEach(url => URL.revokeObjectURL(url));
    if (this.documentURL) {
      URL.revokeObjectURL(this.documentURL);
    }
  }

  onFileAdd(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    
    if (input?.files?.length) {
      const file = input.files[0];  // Get the selected file
      const documentName = file.name;
      const documentURL = URL.createObjectURL(file);  // Create a URL for the file
      
      // Temporarily store the file details for this specific equipment entry
      this.equipmentEntries.at(index).get('file')?.patchValue({
        documentName,
        documentURL
      });
      
      // Also store the actual file in the form (for later submission if needed)
      this.equipmentEntries.at(index).get('equipmentFile')?.setValue(file);
    }
  }
  
  
  uploadEquipmentFile(index: number): void {
    const fileGroup = this.equipmentEntries.at(index).get('file');
    if (fileGroup?.value.documentName && fileGroup?.value.documentURL) {
      console.log('Uploaded Equipment File:', fileGroup.value);
    }
  }
  
  removeEquipmentFile(index: number): void {
    this.equipmentEntries.at(index).get('file')?.reset();
  }
  
  // onDocumentFileChange(event: any): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     this.documentFile = input.files[0]; 
  //   }
  // }

  //  onDocumentFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Update documentForm with file details
  //     this.documentFile = file;
  //     const documentGroup = this.documentForm.get('document') as FormGroup;
  //     documentGroup.patchValue({
  //       documentName: file.name,
  //       documentURL: URL.createObjectURL(file) // Create object URL for the file
  //     });
  //     this.documentURL = documentGroup.value.documentURL;
  //   }
  // }

  onDocumentFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      this.documentFile = file;
      this.documentURL = URL.createObjectURL(file); // Store documentURL for preview
    }
  }
  
  
}



