import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HapticService } from '../../core/services/haptic';

@Component({
  selector: 'app-swipe-actions',
  templateUrl: './swipe-actions.component.html',
  styleUrls: ['./swipe-actions.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SwipeActionsComponent {
  @Output() swipeComplete = new EventEmitter<void>();
  @Output() swipePostpone = new EventEmitter<void>();
  @Output() swipeDelete = new EventEmitter<void>();

  // Referencia al componente nativo para poder cerrarlo programáticamente
  @ViewChild('slidingItem') slidingItem!: IonItemSliding;

  constructor(private haptic: HapticService) {}

  async onComplete() {
    await this.haptic.notificationSuccess();
    this.swipeComplete.emit();
    this.closeSlider();
  }

  async onPostpone() {
    await this.haptic.impactMedium();
    this.swipePostpone.emit();
    this.closeSlider();
  }

  async onDelete() {
    await this.haptic.impactHeavy();
    this.swipeDelete.emit();
    this.closeSlider();
  }

  // Cierra el menú de opciones después de ejecutar la acción
  private closeSlider() {
    if (this.slidingItem) {
      this.slidingItem.close();
    }
  }

  // Opcional: Feedback háptico ligero cuando el usuario empieza a arrastrar
  async onDrag() {
    await this.haptic.impactLight();
  }
}
