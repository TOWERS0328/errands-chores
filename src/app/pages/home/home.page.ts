import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Servicios
import { TaskService } from '../../core/services/task';
import { Task } from '../../core/models/task.model';

// Componentes Compartidos
import { SwipeActionsComponent } from '../../shared/swipe-actions/swipe-actions.component';
import { TaskCardComponent } from '../../shared/task-card/task-card.component';
import { SkeletonCardComponent } from '../../shared/skeleton-card/skeleton-card.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { FabButtonComponent } from '../../shared/fab-button/fab-button.component';
import { BottomSheetComponent } from '../../shared/bottom-sheet/bottom-sheet.component';

type FilterType = 'All' | 'Today' | 'High Priority';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    SwipeActionsComponent,
    TaskCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    FabButtonComponent,
    BottomSheetComponent
  ]
})
export class HomePage implements OnInit {
  // Estado de la UI
  isLoading = true;
  greeting = '';
  currentDate = new Date();

  // Filtros
  filters: FilterType[] = ['All', 'Today', 'High Priority'];
  private currentFilterSubject = new BehaviorSubject<FilterType>('All');
  currentFilter$ = this.currentFilterSubject.asObservable();

  // Lista de tareas reactiva
  filteredTasks$!: Observable<Task[]>;

  // Estado del Bottom Sheet
  isBottomSheetOpen = false;
  taskToEdit?: Task;

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.setGreeting();

    // Simulamos un pequeño retraso de carga para que se vea la animación del skeleton
    setTimeout(() => {
      this.isLoading = false;
    }, 800);

    // Combinamos las tareas del servicio con el filtro actual para mostrar la lista final
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$,
      this.currentFilter$
    ]).pipe(
      map(([tasks, filter]) => {
        // Solo mostramos tareas pendientes por defecto en el Home
        let activeTasks = tasks.filter(t => t.status === 'pending');

        if (filter === 'High Priority') {
          return activeTasks.filter(t => t.priority === 'high');
        }
        if (filter === 'Today') {
          const today = new Date().toDateString();
          return activeTasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today);
        }
        return activeTasks; // 'All'
      })
    );
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 18) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  setFilter(filter: FilterType) {
    this.currentFilterSubject.next(filter);
  }

  // --- ACCIONES DEL MODAL (BOTTOM SHEET) ---

  openCreateTask() {
    this.taskToEdit = undefined;
    this.isBottomSheetOpen = true;
  }

  onModalClosed() {
    this.isBottomSheetOpen = false;
  }

  async saveTaskFromModal(taskData: any) {
    if (this.taskToEdit) {
      await this.taskService.updateTask({ ...this.taskToEdit, ...taskData });
    } else {
      await this.taskService.addTask(taskData);
    }
  }

  // --- ACCIONES DE LOS SWIPES ---

  async markAsDone(taskId: string) {
    await this.taskService.completeTask(taskId);
  }

  async snoozeTask(taskId: string) {
    await this.taskService.postponeTask(taskId);
  }

  async removeTask(taskId: string) {
    await this.taskService.deleteTask(taskId);
  }
}
