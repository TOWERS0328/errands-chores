import { Injectable } from '@angular/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class HapticService {

  constructor() { }

  /**
   * IMPACTOS: Ideales para botones, swipes e interacciones físicas
   */

  // Úsalo para toques rápidos: botón "+", abrir el bottom sheet, cambiar de tab.
  async impactLight() {
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  // Úsalo para acciones de más peso: hacer swipe para posponer, iniciar un drag & drop.
  async impactMedium() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  // Úsalo para acciones destructivas: borrar una tarea (Swipe izquierdo largo).
  async impactHeavy() {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  }

  /**
   * NOTIFICACIONES: Patrones predefinidos del sistema operativo
   */

  // Úsalo exclusivamente cuando se complete una tarea (Swipe derecho corto) o se gane una racha.
  async notificationSuccess() {
    await Haptics.notification({ type: NotificationType.Success });
  }

  // Úsalo si algo falla o si el usuario intenta una acción no permitida.
  async notificationError() {
    await Haptics.notification({ type: NotificationType.Error });
  }

  // Úsalo como advertencia (ej. confirmar antes de borrar definitivamente).
  async notificationWarning() {
    await Haptics.notification({ type: NotificationType.Warning });
  }

  /**
   * SELECCIÓN: Ideal para el Date Picker, el selector de los 5 temas o cambiar prioridades
   */

  async selectionStart() {
    await Haptics.selectionStart();
  }

  async selectionChanged() {
    // Llama a este método cada vez que el valor cambie mientras se arrastra/selecciona
    await Haptics.selectionChanged();
  }

  async selectionEnd() {
    await Haptics.selectionEnd();
  }
}
