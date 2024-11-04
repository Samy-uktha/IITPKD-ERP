import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Optional, if you have custom styles
})
export class HomeComponent implements OnInit {
  selectedTab = 'PENDING';
  displayData(tab: string) {
    this.selectedTab = tab;
    this.activeButton = tab;
  }
  isActive(status: string): boolean {
    return this.activeButton === status;
  }
  projectForm: FormGroup;
  facultyForm: FormGroup;
  equipmentForm: FormGroup;
  purchaseForm: FormGroup;
  documentForm: FormGroup;

  activeButton: string | null = null;

  project = {
    title: '',
    area: '',
    duration: 0,
    category: '',
    subArea: '',
    totalCost: 0,
    foreignExp: [], // Assuming it's an array of experiences
    outline: {
      overview: '',
      scope: '',
      intellectualMerits: '',
      broaderImpacts: '',
    },
    novelty: {
      uniqueness: '',
      innovativeness: '',
      novelty: '',
    },
  };

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectCategory: ['', Validators.required],
      projectID: ['', Validators.required],
      projectGrant: ['', Validators.required],
      projectDescription: ['', Validators.required],
    });

    this.facultyForm = this.fb.group({
      facultyName: ['', Validators.required],
      facultyDep: ['', Validators.required],
      facultyEmail: ['', Validators.required],
      facultyPhone: ['', Validators.required],
    })

    this.equipmentForm = this.fb.group({
      equipmentEntries: this.fb.array([]),
      // equipmentName: ['', Validators.required],
      // quantity: ['', [Validators.required, Validators.min(1)]],
      // cost: ['', [Validators.required, Validators.min(0)]]
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
    // Initialize project data if needed
    this.initializeProject();
    this.addEquipmentEntry();
  }

  get equipmentEntries(): FormArray {
    return this.equipmentForm.get('equipmentEntries') as FormArray;
  }

  // Method to add a new equipment entry
  addEquipmentEntry(): void {
    const equipmentEntry = this.fb.group({
      equipmentName: ['', Validators.required],
      quantity: [0, Validators.required],
      cost: [0, Validators.required],
    });
    this.equipmentEntries.push(equipmentEntry);
  }

  // Method to remove an equipment entry
  removeEquipmentEntry(index: number): void {
    this.equipmentEntries.removeAt(index);
  }

  initializeProject(): void {
    // Example of initializing project details
    this.project.title = 'Sample Project';
    this.project.area = 'Research';
    this.project.duration = 12;
    this.project.category = 'Development';
    this.project.subArea = 'Software';
    this.project.totalCost = 50000;

    this.project.outline.overview = 'Overview of the project...';
    this.project.outline.scope = 'Scope of the project...';
    this.project.outline.intellectualMerits = 'Intellectual merits...';
    this.project.outline.broaderImpacts = 'Broader impacts...';

    this.project.novelty.uniqueness = 'Unique aspects of the project...';
    this.project.novelty.innovativeness = 'Innovative methods...';
    this.project.novelty.novelty = 'Novel contributions...';
  }

  onSubmit(): void {
    // Handle form submission
    if (
      this.projectForm.valid &&
      this.facultyForm.valid &&
      this.equipmentForm.valid &&
      this.purchaseForm.valid &&
      this.documentForm.valid
    ) {
      const projectData = {
        projectDetails: this.projectForm.value,
        equipmentDetails: this.equipmentForm.value,
        purchaseDetails: this.purchaseForm.value,
        document: this.documentForm.value.document,
      };
      console.log('Submitted Data:', projectData);
      // You can also send this data to your backend here
    }
  }

  sendClickNext(): void {
    // Handle the "Next" button click
    this.onSubmit(); // Optional: if you want to submit before navigating
    // Navigate to the next step or perform any action here
  }
}
