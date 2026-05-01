import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

// Importamos el servicio de temas y su tipo
import { ThemeService, AppTheme } from '../../core/services/theme';
import { HapticService } from '../../core/services/haptic';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OnboardingPage implements OnInit {

  // Lista de los 5 temas requeridos
  themes: { id: AppTheme, name: string, color: string }[] = [
    { id: 'light', name: 'Light', color: '#F5F5F5' },
    { id: 'dark', name: 'Dark', color: '#1C1C1E' },
    { id: 'rose', name: 'Rosé', color: '#852E4E' },
    { id: 'forest', name: 'Forest', color: '#1C3D2C' },
    { id: 'latte', name: 'Latte', color: '#F5E8E4' }
  ];

  currentTheme: AppTheme = 'light';

  constructor(
    private themeService: ThemeService,
    private haptic: HapticService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  async selectTheme(themeId: AppTheme) {
    await this.haptic.selectionChanged();
    this.currentTheme = themeId;
    await this.themeService.setTheme(themeId); // Aplica el tema al <body> en tiempo real
  }

  async getStarted() {
    await this.haptic.impactHeavy();

    // Guardamos en la base de datos nativa que el usuario ya vio el onboarding
    await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });

    // Lo enviamos al Home reemplazando la URL para que no pueda volver atrás
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
