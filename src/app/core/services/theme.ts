import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences'; // Usaremos Preferences para guardar el tema elegido

export type AppTheme = 'light' | 'dark' | 'rose' | 'forest' | 'latte';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: AppTheme = 'light';
  private readonly THEME_KEY = 'selected-app-theme';

  constructor() {}

  async initializeTheme() {
    const { value } = await Preferences.get({ key: this.THEME_KEY });
    if (value) {
      this.setTheme(value as AppTheme);
    } else {
      // Tema por defecto o basado en el sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  async setTheme(theme: AppTheme) {
    // Removemos el tema anterior
    document.body.classList.remove(this.currentTheme);

    // Aplicamos el nuevo
    document.body.classList.add(theme);
    this.currentTheme = theme;

    // Guardamos la preferencia
    await Preferences.set({ key: this.THEME_KEY, value: theme });
  }

  getCurrentTheme(): AppTheme {
    return this.currentTheme;
  }
}
