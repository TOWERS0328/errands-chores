import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HapticService } from '../../core/services/haptic';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class FabButtonComponent {
  // Permite configurar el icono, por si alguna vez quieres usar un FAB para otra cosa (ej. "check" o "save")
  @Input() icon: string = 'add';

  // Soporte para la variante "with label" (ej. "New Task")
  @Input() label?: string;

  // Controla la posición (útil si alguna vez necesitas un FAB centrado)
  @Input() position: 'bottom-end' | 'bottom-center' | 'bottom-start' = 'bottom-end';

  @Output() fabClick = new EventEmitter<void>();

  constructor(private haptic: HapticService) {}

  async onClick() {
    // Feedback háptico ligero al tocar el FAB, tal como pediste
    await this.haptic.impactLight();
    this.fabClick.emit();
  }
}
