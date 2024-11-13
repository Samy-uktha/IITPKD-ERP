import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-screen.component.html',
})
export class ViewScreenComponent implements OnDestroy {
  @Input() projectData: any;
  @Input() equipmentEntries!: FormArray;
  @Input() documentFile: File | null = null;
  @Input() submissionDate!: string;
  
  private _documentURL: string | null = null;
  private equipmentFileURLs: string[] = [];

  get documentURL(): string | null {
    if (!this._documentURL && this.documentFile) {
      this._documentURL = URL.createObjectURL(this.documentFile);
    }
    return this._documentURL;
  }

 

  // getEquipmentFileURL(index: number): string | null {
  //   const equipmentFile = this.equipmentEntries.at(index).value.equipmentFile;
  //   if (equipmentFile) {
  //     // Create URL if it does not already exist
  //     if (!this.equipmentFileURLs[index]) {
  //       this.equipmentFileURLs[index] = URL.createObjectURL(equipmentFile);
  //     }
  //     return this.equipmentFileURLs[index];
  //   }
  //   return null;
  // }

  // getEquipmentFileURL(event: any, index: number): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileURL = URL.createObjectURL(file);
      
  //     // Set the document metadata into the file group
  //     const fileGroup = this.equipmentEntries.at(index).get('file') as FormGroup;
  //     fileGroup.get('documentName')?.setValue(file.name);
  //     fileGroup.get('documentURL')?.setValue(fileURL);
  //   }
  // }
  

  ngOnDestroy(): void {
    if (this.documentURL) {
      URL.revokeObjectURL(this.documentURL);
    }
  }
}


