import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly TASKS_KEY = 'errands_tasks';

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa la base de datos local.
   * Por defecto, Ionic Storage usa IndexedDB, que es perfecto para almacenar
   * grandes cantidades de datos como las fotos adjuntas.
   */
  async init() {
    // Crea la base de datos si no existe, o se conecta a la actual
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Obtiene la lista completa de tareas desde la base de datos.
   */
  async getTasks(): Promise<Task[]> {
    await this.ensureStorage();
    const tasks = await this._storage?.get(this.TASKS_KEY);
    return tasks || []; // Retorna un arreglo vacío si es la primera vez
  }

  /**
   * Sobrescribe toda la lista de tareas.
   * Ideal para cuando reordenamos con Drag & Drop o actualizamos la base de datos completa.
   */
  async setTasks(tasks: Task[]): Promise<void> {
    await this.ensureStorage();
    await this._storage?.set(this.TASKS_KEY, tasks);
  }

  /**
   * Utilidad para guardar una sola tarea (Crear o Editar).
   */
  async saveTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);

    if (index >= 0) {
      // Editar: la tarea ya existe
      tasks[index] = task;
    } else {
      // Crear: es una tarea nueva
      tasks.push(task);
    }

    await this.setTasks(tasks);
  }

  /**
   * Utilidad para eliminar una tarea específica por su ID.
   */
  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    await this.setTasks(filteredTasks);
  }

  /**
   * Garantiza que el almacenamiento esté inicializado antes de hacer cualquier operación.
   * Útil si el usuario intenta guardar algo justo cuando la app está abriendo.
   */
  private async ensureStorage(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }
}
