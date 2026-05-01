import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    this.initialize();
  }

  async initialize() {
    // 1. Solicitar permisos al usuario (Obligatorio en iOS y Android 13+)
    const permissions = await LocalNotifications.requestPermissions();
    if (permissions.display !== 'granted') {
      console.warn('Permisos de notificación denegados');
      return;
    }

    // 2. Registrar los tipos de acciones para que aparezcan los botones
    // en la notificación del lock screen (Completar / Posponer)
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'TASK_ACTIONS',
          actions: [
            {
              id: 'complete',
              title: '✓ Completar',
              destructive: false,
              foreground: true // Abre la app o ejecuta en segundo plano
            },
            {
              id: 'snooze',
              title: '⏱ Posponer',
              destructive: true,
              foreground: false
            }
          ]
        }
      ]
    });

    // 3. Escuchar las acciones de los botones de la notificación
    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      const taskId = notificationAction.notification.extra?.taskId;

      if (notificationAction.actionId === 'complete') {
        // Aquí llamarás a tu TaskService para marcarla como completada
        console.log(`Tarea ${taskId} completada desde la notificación`);
      } else if (notificationAction.actionId === 'snooze') {
        // Por defecto posponemos 1 hora (60 minutos)
        this.snoozeReminder(taskId, 60);
      }
    });
  }

  /**
   * Programa el recordatorio principal de una tarea basándose en su configuración
   */
  async scheduleTaskReminder(task: Task) {
    if (!task.reminder.enabled || !task.reminder.time) return;

    const scheduleDate = new Date(task.reminder.time);

    // Convertir tu string de repetición al enum de Capacitor
    let every: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | undefined;
    if (task.reminder.repeat === 'daily') every = 'day';
    if (task.reminder.repeat === 'weekly') every = 'week';
    if (task.reminder.repeat === 'monthly') every = 'month';

    await LocalNotifications.schedule({
      notifications: [
        {
          // Necesitamos un ID numérico para el plugin de notificaciones
          id: this.generateNumericId(task.id),
          title: task.title,
          body: task.description || 'Tienes una tarea pendiente',
          schedule: {
            at: scheduleDate,
            every: every,
            allowWhileIdle: true // Asegura que suene aunque el teléfono esté en Doze mode
          },
          actionTypeId: 'TASK_ACTIONS',
          extra: { taskId: task.id },
          sound: 'beep.wav', // Puedes añadir un sonido personalizado en la carpeta res/raw de Android
          smallIcon: 'ic_stat_icon_config_sample' // Ícono transparente nativo
        }
      ]
    });
  }

  /**
   * Pospone una notificación sumando minutos a la fecha actual
   */
  async snoozeReminder(taskId: string, minutes: number) {
    const numericId = this.generateNumericId(taskId);

    // Primero cancelamos la anterior por si acaso
    await this.cancelReminder(taskId);

    const snoozeDate = new Date();
    snoozeDate.setMinutes(snoozeDate.getMinutes() + minutes);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: numericId,
          title: 'Recordatorio pospuesto',
          body: 'Revisar tarea',
          schedule: { at: snoozeDate, allowWhileIdle: true },
          actionTypeId: 'TASK_ACTIONS',
          extra: { taskId: taskId }
        }
      ]
    });
  }

  /**
   * Cancela el recordatorio de una tarea (ej. si el usuario la borra o la completa antes)
   */
  async cancelReminder(taskId: string) {
    await LocalNotifications.cancel({
      notifications: [{ id: this.generateNumericId(taskId) }]
    });
  }

  /**
   * Programa el "Resumen Diario" silencioso a las 8:00 AM
   */
  async scheduleDailySummary(pendingCount: number) {
    const summaryDate = new Date();
    summaryDate.setHours(8, 0, 0, 0);
    if (summaryDate.getTime() < new Date().getTime()) {
      summaryDate.setDate(summaryDate.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999999, // ID reservado para el resumen
          title: 'Resumen Diario',
          body: `Tienes ${pendingCount} tareas pendientes para hoy.`,
          schedule: { at: summaryDate, every: 'day' },
          sound: undefined, // Notificación silenciosa
        }
      ]
    });
  }

  /**
   * Utilidad para convertir el UUID (string) de tu tarea a un ID numérico (requerido por Capacitor)
   */
  private generateNumericId(uuid: string): number {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      hash = (hash << 5) - hash + uuid.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
