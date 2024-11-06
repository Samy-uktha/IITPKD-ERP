import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-faculty-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './faculty-card.component.html',
})
export class FacultyCardComponent {
  @Input() form!: FormGroup;
}
