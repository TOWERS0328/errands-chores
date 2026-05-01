import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskPriority } from '../../core/models/task.model';

@Component({
  selector: 'app-priority-badge',
  templateUrl: './priority-badge.component.html',
  styleUrls: ['./priority-badge.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PriorityBadgeComponent {
  // Recibe la prioridad (viene del modelo que creamos: 'high' | 'medium' | 'low')
  @Input() priority: TaskPriority = 'medium';

  // Permite mostrar solo el punto de color si el espacio es reducido
  @Input() showLabel: boolean = true;

  // Capitaliza la primera letra para la vista (ej. "high" -> "High")
  get formattedLabel(): string {
    if (!this.priority) return '';
    return this.priority.charAt(0).toUpperCase() + this.priority.slice(1);
  }
}
