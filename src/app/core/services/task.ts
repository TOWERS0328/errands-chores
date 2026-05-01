import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { StorageService } from './storage';
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // BehaviorSubject mantiene el estado actual y emite los cambios a los componentes
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(
    private storage: StorageService,
    private notification: NotificationService
  ) {
    // Cargar tareas al iniciar el servicio
    this.loadTasks();
  }

  /**
   * Carga la lista desde la base de datos local y actualiza el estado
   */
  async loadTasks() {
    const tasks = await this.storage.getTasks();
    this.tasksSubject.next(tasks);

    // Actualizamos el resumen diario silencioso con el conteo actual
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    await this.notification.scheduleDailySummary(pendingTasks.length);
  }

  /**
   * Crea una nueva tarea (Llamado desde el Bottom Sheet)
   */
  async addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(), // Genera un ID único nativo del navegador/móvil
      createdAt: Date.now(),
      status: 'pending' as TaskStatus
    };

    // 1. Guardar en Storage
    await this.storage.saveTask(newTask);

    // 2. Programar notificación si está habilitada
    await this.notification.scheduleTaskReminder(newTask);

    // 3. Recargar la lista reactiva
    await this.loadTasks();
  }

  /**
   * Actualiza una tarea existente (Editar)
   */
  async updateTask(updatedTask: Task): Promise<void> {
    await this.storage.saveTask(updatedTask);

    // Actualizar los recordatorios dependiendo del estado
    if (updatedTask.status === 'pending') {
      await this.notification.scheduleTaskReminder(updatedTask);
    } else {
      await this.notification.cancelReminder(updatedTask.id);
    }

    await this.loadTasks();
  }

  /**
   * Elimina una tarea definitivamente (Swipe izquierda largo)
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.storage.deleteTask(taskId);
    await this.notification.cancelReminder(taskId);
    await this.loadTasks();
  }

  /**
   * Marca una tarea como completada (Swipe derecha corto)
   */
  async completeTask(taskId: string): Promise<void> {
    const tasks = this.tasksSubject.getValue();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      task.status = 'completed';
      task.completedAt = Date.now();

      await this.storage.saveTask(task);
      await this.notification.cancelReminder(taskId); // Ya no suena la alarma
      await this.loadTasks();
    }
  }

  /**
   * Pospone una tarea para el día siguiente (Swipe izquierda corto)
   */
  async postponeTask(taskId: string): Promise<void> {
    const tasks = this.tasksSubject.getValue();
    const task = tasks.find(t => t.id === taskId);

    if (task && task.dueDate) {
      // Sumar 1 día (24 horas) a la fecha límite
      const currentDate = new Date(task.dueDate);
      currentDate.setDate(currentDate.getDate() + 1);
      task.dueDate = currentDate.toISOString();

      // Si tiene recordatorio configurado, posponer también la hora de la alarma
      if (task.reminder && task.reminder.time) {
        const reminderDate = new Date(task.reminder.time);
        reminderDate.setDate(reminderDate.getDate() + 1);
        task.reminder.time = reminderDate.toISOString();
      }

      await this.updateTask(task);
    }
  }

  /**
   * Utilidad para obtener una sola tarea por su ID (Ideal para la pantalla Task Detail)
   */
  getTaskById(taskId: string): Task | undefined {
    return this.tasksSubject.getValue().find(t => t.id === taskId);
  }
}
