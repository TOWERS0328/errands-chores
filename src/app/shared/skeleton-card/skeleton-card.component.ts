import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  templateUrl: './skeleton-card.component.html',
  styleUrls: ['./skeleton-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SkeletonCardComponent {
  constructor() {}
}
