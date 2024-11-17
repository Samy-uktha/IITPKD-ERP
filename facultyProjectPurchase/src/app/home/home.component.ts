
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project, Equipment, Document } from '../interfaces';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { ViewScreenComponent } from '../view-screen/view-screen.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { SubmissionService } from '../submission.service';
import { ProjectStatus } from '../interfaces';


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
  selectedTab: string = 'Pending';
  
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
    this.submissionDate = new Date().toLocaleTimeString();
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

  showSubmitButton: boolean=true;

  handleProjectSelection({ project, generatePreview }: { project: Project; generatePreview: boolean }): void {
    this.selectedProject = project;
    if (generatePreview) {
      // Generate the preview screen
      this.projectData = project;
  
      // Populate the equipment form array from the project data
      this.equipmentEntries.clear();
      project.equipments.forEach(equipment => {
        const equipmentEntry = this.fb.group({
          equipmentName: [equipment.name],
          equipmentSpecs: [equipment.specs],
          equipmentQuantity: [equipment.quantity],
          equipmentJustification: [equipment.justification],
          file: this.fb.group({
            documentName: [equipment.file?.documentName || ''],
            documentURL: [equipment.file?.documentURL || ''],
          }),
        });
        this.equipmentEntries.push(equipmentEntry);
      });
  
      this.showSubmitButton = false;
      this.showPreview = true;
    } else {
      // Only autofill project details
      this.projectData = null;
      this.showPreview = false;
      this.autofillProjectDetails(project);
    }
  }

  autofillProjectDetails(project: Project): void {
    if (!project) return;
  
    // Example of populating the form fields from the project data
    this.equipmentForm.patchValue({
      equipmentEntries: project.equipments.map(equipment => ({
        equipmentName: equipment.name,
        equipmentSpecs: equipment.specs,
        equipmentQuantity: equipment.quantity,
        equipmentJustification: equipment.justification,
      })),
    });
  
    // Ensure the form array matches the number of entries in project.equipments
    this.equipmentEntries.clear();
    project.equipments.forEach(() => this.addEquipmentEntry());
  
    // Clear non-project fields
    this.documentForm.reset();
  }
  

  onProjectFormChange(projectData: Project): void {
    this.projectData = projectData;
    console.log("onprojectformchange",projectData)
  }

  // resetForms(): void {
  //   this.equipmentForm.reset();
  //   this.documentForm.reset();
  //   this.revokeURLs();
  //   this.equipmentEntries.clear();
  //   this.addEquipmentEntry();

  // }

  generatePreview(): void {
    if (!this.projectData || !this.isProjectFormValid() || !this.isEquipmentValid()) {
      alert('Please fill all required fields in the project form and add at least one valid equipment.');
      return;
    }
    this.submissionDate = new Date().toLocaleDateString();
    this.showPreview = true;
    this.saveData();

    // if (this.projectData && this.equipmentForm.valid && this.documentForm.valid) {
    //   this.submissionDate = new Date().toLocaleDateString();
    //   this.showPreview = true;
    //   this.saveData();
    // } else {
    //   alert("Please fill all fields.");
    // }
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

    if (!this.projectData || !this.isProjectFormValid() || !this.isEquipmentValid()) {
      alert('Please fill all required fields in the project form and add at least one valid equipment.');
      return;
    } else {

    // if(this.projectData){
    const projectDetails : Project = {
    ...this.projectData,
    equipments: this.equipmentEntries.controls.map((entry: AbstractControl) => {
      const equipmentName = entry.get('equipmentName')?.value || "N/A";
      const equipmentSpecs = entry.get('equipmentSpecs')?.value || "";
      const equipmentQuantity = entry.get('equipmentQuantity')?.value || 0;
      const equipmentJustification = entry.get('equipmentJustification')?.value || "";

      const file = entry.get('file')?.value; 

      const fileGroup = entry.get('file');
      const documentName = fileGroup?.get('documentName')?.value || 'No file uploaded';
      const documentURL = fileGroup?.get('documentURL')?.value || '';


      return {
        name: equipmentName,
        specs: equipmentSpecs,
        quantity: equipmentQuantity,
        justification: equipmentJustification,
        file: {
          // documentName: file?.documentName || "No file uploaded",
          // documentURL: file?.documentURL || ""
          documentName,
          documentURL,
        }
      };
    }),
    document: [{
      documentName: this.documentForm.get('document')?.value?.name || "No document uploaded",
      documentURL: this.documentURL || ""
    }]
  };
    
  this.submissionService.addSubmission(projectDetails);
  console.log("projectdetails",projectDetails);
  
    const jsonData = JSON.stringify(projectDetails, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_data.json';
    a.click();
    URL.revokeObjectURL(url);

    this.showPreview = false;
    this.selectedTab = 'Pending';
    // this.resetForms();
    alert('Data has been saved as a JSON file.');
    }
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
      
      // // Temporarily store the file details for this specific equipment entry
      // this.equipmentEntries.at(index).get('file')?.patchValue({
      //   documentName,
      //   documentURL
      // });
      
      // // Also store the actual file in the form (for later submission if needed)
      // this.equipmentEntries.at(index).get('equipmentFile')?.setValue(file);

      const fileGroup = this.equipmentEntries.at(index).get('file');
    fileGroup?.patchValue({
      documentName,
      documentURL,
    });
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
  


  onDocumentFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      this.documentFile = file;
      this.documentURL = URL.createObjectURL(file); // Store documentURL for preview
    }
  }
  
  isProjectFormValid(): boolean {
    return (
      this.projectData?.name &&
      this.projectData?.id &&
      this.projectData?.category &&
      this.projectData?.duration &&
      this.projectData?.budget &&
      this.projectData?.grant &&
      this.projectData?.description
    ) !== undefined;
  }
  
  isEquipmentValid(): boolean {
    return this.equipmentEntries.controls.some((entry) => {
      const name = entry.get('equipmentName')?.value;
      const quantity = entry.get('equipmentQuantity')?.value;
      return !!name && quantity > 0; // Ensure at least one equipment with a name and quantity
    })
  }
  
}



