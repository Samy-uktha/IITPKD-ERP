import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-screen.component.html',
})
export class ViewScreenComponent {
  @Input() projectData: any;
  @Input() equipmentEntries!: any[];
  @Input() documentFile: any;
  @Input() submissionDate!: string;
  @Input() documentURL: string | null = null;
}
