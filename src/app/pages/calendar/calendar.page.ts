import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { TaskService } from '../../core/services/task';
import { Task } from '../../core/models/task.model';

import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { SwipeActionsComponent } from '../../shared/swipe-actions/swipe-actions.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';

// Interfaz local para representar cada "cuadrito" del calendario
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasTasks: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TaskCardComponent,
    SwipeActionsComponent,
    EmptyStateComponent
  ]
})
export class CalendarPage implements OnInit, OnDestroy {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarGrid: CalendarDay[] = [];

  viewDate: Date = new Date(); // El mes que estamos viendo actualmente
  selectedDate: Date = new Date(); // El día seleccionado por el usuario

  allTasks: Task[] = [];
  agendaTasks: Task[] = [];

  private tasksSub!: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // Escuchamos las tareas en tiempo real
    this.tasksSub = this.taskService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.generateCalendar();
      this.updateAgenda();
    });
  }

  ngOnDestroy() {
    if (this.tasksSub) this.tasksSub.unsubscribe();
  }

  /**
   * Genera la cuadrícula matemática del mes actual
   */
  generateCalendar() {
    this.calendarGrid = [];

    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Obtenemos qué día de la semana empieza el mes (0 = Domingo)
    const startingDayIndex = firstDayOfMonth.getDay();

    // 1. Rellenar los días del mes anterior (espacios vacíos al inicio)
    for (let i = 0; i < startingDayIndex; i++) {
      const d = new Date(year, month, 0 - (startingDayIndex - 1 - i));
      this.calendarGrid.push(this.createDayObject(d, false));
    }

    // 2. Rellenar los días del mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      this.calendarGrid.push(this.createDayObject(d, true));
    }

    // 3. Rellenar los días del mes siguiente para completar la última fila de la cuadrícula (opcional, para mantener el alto)
    const remainingSlots = 42 - this.calendarGrid.length; // 6 filas de 7 días = 42
    for (let i = 1; i <= remainingSlots; i++) {
      const d = new Date(year, month + 1, i);
      this.calendarGrid.push(this.createDayObject(d, false));
    }
  }

  createDayObject(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();

    // Verificar si este día tiene tareas asignadas
    const hasTasks = this.allTasks.some(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === date.toDateString() && t.status === 'pending';
    });

    return {
      date: date,
      isCurrentMonth: isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === this.selectedDate.toDateString(),
      hasTasks: hasTasks
    };
  }

  // --- NAVEGACIÓN Y SELECCIÓN ---

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    this.selectedDate = day.date;

    // Si toca un día de otro mes, saltamos a ese mes
    if (!day.isCurrentMonth) {
      this.viewDate = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
    }

    this.generateCalendar(); // Regeneramos para actualizar la clase CSS 'isSelected'
    this.updateAgenda();
  }

  /**
   * Filtra las tareas para mostrar solo las del día seleccionado en la lista de abajo
   */
  updateAgenda() {
    this.agendaTasks = this.allTasks.filter(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === this.selectedDate.toDateString() && t.status === 'pending';
    });
  }

  // --- SWIPE ACTIONS ---

  async completeTask(taskId: string) { await this.taskService.completeTask(taskId); }
  async postponeTask(taskId: string) { await this.taskService.postponeTask(taskId); }
  async deleteTask(taskId: string) { await this.taskService.deleteTask(taskId); }
}
