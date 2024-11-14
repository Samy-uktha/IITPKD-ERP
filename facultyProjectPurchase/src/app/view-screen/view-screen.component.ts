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
  private equipmentFileURLs: { [key: number]: string } = {};

  get documentURL(): string | null {
    if (!this._documentURL && this.documentFile) {
      this._documentURL = URL.createObjectURL(this.documentFile);
    }
    return this._documentURL;
  }

  isFormGroup(entry: any): boolean {
    return entry instanceof FormGroup;
  }

  getEquipmentFileURL(index: number): string | null {
    const equipmentFile = this.equipmentEntries.at(index).value.equipmentFile;
    if (equipmentFile) {
      // Create URL if it does not already exist
      if (!this.equipmentFileURLs[index]) {
        this.equipmentFileURLs[index] = URL.createObjectURL(equipmentFile);
      }
      return this.equipmentFileURLs[index];
    }
    return null;
  }

  ngOnDestroy(): void {
    // Revoke the object URL to release memory
    if (this._documentURL) {
      URL.revokeObjectURL(this._documentURL);
    }
    Object.values(this.equipmentFileURLs).forEach(url => URL.revokeObjectURL(url));
  }
}


