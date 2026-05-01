import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class EmptyStateComponent {
  // Datos configurables para usarlo en cualquier pantalla
  @Input() icon: string = 'leaf-outline';
  @Input() title: string = 'Nothing here yet';
  @Input() message: string = 'There is no data to show at the moment.';
  @Input() actionText?: string; // Si se pasa este texto, aparece un botón

  @Output() action = new EventEmitter<void>();

  onAction() {
    this.action.emit();
  }
}
