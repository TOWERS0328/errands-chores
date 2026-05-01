import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tag-pill',
  templateUrl: './tag-pill.component.html',
  styleUrls: ['./tag-pill.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TagPillComponent {
  // Datos de la etiqueta
  @Input() name: string = '';
  @Input() color: string = '#534AB7'; // Color por defecto (Accent Light)

  // Modos del componente
  @Input() removable: boolean = false; // Muestra una 'X' para borrarla (útil en formularios)
  @Input() isAddBtn: boolean = false;  // Transforma el pill en el botón "+ New"

  // Eventos
  @Output() pillClick = new EventEmitter<void>();
  @Output() removeClick = new EventEmitter<Event>();

  onPillClick() {
    this.pillClick.emit();
  }

  onRemoveClick(event: Event) {
    // Detenemos la propagación para que al hacer clic en la 'X'
    // no se dispare también el evento de clic de toda la etiqueta
    event.stopPropagation();
    this.removeClick.emit(event);
  }
}
