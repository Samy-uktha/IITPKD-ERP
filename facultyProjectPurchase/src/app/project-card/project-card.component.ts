import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './project-card.component.html',

})
export class ProjectCardComponent {
  @Input() form!: FormGroup;
}
