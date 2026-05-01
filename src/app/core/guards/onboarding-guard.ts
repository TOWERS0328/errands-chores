import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {

  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Verificamos en el almacenamiento nativo si ya completó el onboarding
    const { value } = await Preferences.get({ key: 'hasSeenOnboarding' });

    if (value === 'true') {
      // Si ya lo vio, le permitimos el paso a la ruta (ej. Home)
      return true;
    } else {
      // Si es la primera vez (value es null), lo enviamos a la pantalla de Onboarding
      // Usamos replaceUrl para que no pueda volver atrás con el botón de retroceso de Android
      this.router.navigateByUrl('/onboarding', { replaceUrl: true });
      return false;
    }
  }
}
