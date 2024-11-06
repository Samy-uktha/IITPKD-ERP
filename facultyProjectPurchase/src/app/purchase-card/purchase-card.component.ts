// import { Component, Input, OnInit } from '@angular/core';
// import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-purchase-card',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './purchase-card.component.html',
// })
// export class PurchaseCardComponent implements OnInit{

//   @Input() form!: FormGroup;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     // Initialize project data if needed
//     // this.initializeProject();
//     this.addEquipmentEntry();
//   }


//   get equipmentEntries(): FormArray {
//     return this.form.get('equipmentEntries') as FormArray;
//   }

//   // Method to add a new equipment entry
//   addEquipmentEntry(): void {
//     const equipmentEntry = this.fb.group({
//       equipmentName: ['', Validators.required],
//       quantity: [0, Validators.required],
//       cost: [0, Validators.required],
//       vendor: ['', Validators.required],
//     });
//     this.equipmentEntries.push(equipmentEntry);
//   }

//   // Method to remove an equipment entry
//   removeEquipmentEntry(index: number): void {
//     this.equipmentEntries.removeAt(index);
//   }

//   onSubmit(): void {
//     if (this.form.valid) {
//       console.log('Purchase Form Submitted:', this.form.value);
//     } else {
//       console.log('Purchase Form is invalid');
//     }
//   }
  
// }
