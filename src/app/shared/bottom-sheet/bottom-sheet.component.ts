import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task.model';
import { HapticService } from '../../core/services/haptic';
import { CameraService } from '../../core/services/camera';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class BottomSheetComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() taskToEdit?: Task; // Si viene una tarea, es modo "Editar", si no, es "Crear"

  @Output() modalClosed = new EventEmitter<void>();
  @Output() saveTask = new EventEmitter<any>();

  taskForm!: FormGroup;
  attachedPhotos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private haptic: HapticService,
    private camera: CameraService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: [this.taskToEdit?.title || '', Validators.required],
      description: [this.taskToEdit?.description || ''],
      priority: [this.taskToEdit?.priority || 'medium'],
      dueDate: [this.taskToEdit?.dueDate || new Date().toISOString()]
    });

    if (this.taskToEdit?.photos) {
      this.attachedPhotos = [...this.taskToEdit.photos];
    }
  }

  async takePhoto() {
    await this.haptic.impactLight();
    const photo = await this.camera.takePhoto();
    if (photo && photo.base64String) {
      // Convertimos a URL segura para mostrar en el HTML
      const webSafeUrl = this.camera.getWebSafeUrl(photo.base64String, photo.format);
      this.attachedPhotos.push(webSafeUrl);
    }
  }

  async onSave() {
    if (this.taskForm.invalid) {
      await this.haptic.notificationError();
      return;
    }

    await this.haptic.notificationSuccess();
    const taskData = {
      ...this.taskForm.value,
      photos: this.attachedPhotos
    };

    this.saveTask.emit(taskData);
    this.dismissModal();
  }

  dismissModal() {
    this.isOpen = false;
    this.modalClosed.emit();
    // Reseteamos el formulario si estábamos creando
    if (!this.taskToEdit) {
      this.taskForm.reset({ priority: 'medium' });
      this.attachedPhotos = [];
    }
  }

  // Intercepta cuando el usuario baja el modal arrastrándolo
  onWillDismiss(event: any) {
    this.dismissModal();
  }
}
