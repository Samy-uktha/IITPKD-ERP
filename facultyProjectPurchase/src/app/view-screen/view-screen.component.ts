import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';

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

  get documentURL(): string | null {
    if (!this._documentURL && this.documentFile) {
      this._documentURL = URL.createObjectURL(this.documentFile);
    }
    return this._documentURL;
  }

  ngOnDestroy(): void {
    // Revoke the object URL to release memory
    if (this._documentURL) {
      URL.revokeObjectURL(this._documentURL);
    }
  }
}


