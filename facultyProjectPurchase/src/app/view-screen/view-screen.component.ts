import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-view-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-screen.component.html',
})
export class ViewScreenComponent {
  @Input() projectData: any;
  @Input() equipmentEntries!: FormArray;
  @Input() documentFile: any;
  @Input() submissionDate!: string;
  private _documentURL: string | null = null;

  get documentURL() {
    if (!this._documentURL && this.documentFile) {
      this._documentURL = URL.createObjectURL(this.documentFile);
    }
    return this._documentURL;
  }
  }

