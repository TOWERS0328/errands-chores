import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Task } from '../../core/models/task.model';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { TagPillComponent } from '../tag-pill/tag-pill.component';
import { AnimationService } from '../../core/services/animation';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: true,
  // Importamos los shared components que creamos antes para usarlos aquí dentro
  imports: [CommonModule, IonicModule, PriorityBadgeComponent, TagPillComponent]
})
export class TaskCardComponent {
  @Input() task!: Task;

  @ViewChild('cardElement', { static: true }) cardElement!: ElementRef;

  constructor(private animation: AnimationService) {}

  // Getter útil para saber si debemos renderizar la columna de la foto
  get hasPhoto(): boolean {
    return !!(this.task?.photos && this.task.photos.length > 0);
  }

  // Método público por si necesitas detonar la animación de volteo desde afuera
  flip() {
    this.animation.flipCard(this.cardElement.nativeElement);
  }
}
