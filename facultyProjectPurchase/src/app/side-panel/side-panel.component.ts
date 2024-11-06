import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
})
export class SidePanelComponent {
  @Input() selectedTab?: string;

  // Emit event when a tab is clicked, sending the new selected tab to the parent
  @Output() tabChange = new EventEmitter<string>();

  // Method to set the active tab and emit the change
  setTab(tabName: string): void {
    this.selectedTab = tabName;
    this.tabChange.emit(tabName); // Emit the selected tab to the parent
  }
}
