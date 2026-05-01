import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }

  /**
   * ==========================================
   * ANIMACIONES CON ANIMATE.CSS
   * ==========================================
   */

  // Utilidad genérica para inyectar clases de Animate.css y limpiar al terminar
  private animateCSS(element: HTMLElement, animation: string, prefix = 'animate__'): Promise<void> {
    return new Promise((resolve) => {
      const animationName = `${prefix}${animation}`;
      element.classList.add(`${prefix}animated`, animationName);

      // Limpia las clases cuando termina la animación para poder repetirla luego
      const handleAnimationEnd = (event: Event) => {
        event.stopPropagation();
        element.classList.remove(`${prefix}animated`, animationName);
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd, { once: true });
    });
  }

  // Shake al intentar borrar
  async shake(element: HTMLElement) {
    await this.animateCSS(element, 'shakeX');
  }

  // Bounce en el badge del widget o notificaciones
  async bounce(element: HTMLElement) {
    await this.animateCSS(element, 'bounce');
  }


  /**
   * ==========================================
   * ANIMACIONES AVANZADAS CON GSAP
   * ==========================================
   */

  // Flip card al editar tarea
  flipCard(element: HTMLElement) {
    // Resetea cualquier rotación previa
    gsap.set(element, { rotationY: 0 });

    gsap.to(element, {
      rotationY: 360,
      duration: 0.6,
      ease: "back.out(1.7)",
      transformOrigin: "50% 50%"
    });
  }

  // Animación suave al marcar ✓ completado (escala y baja opacidad)
  completeTaskFade(element: HTMLElement) {
    gsap.to(element, {
      scale: 0.95,
      opacity: 0.6,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  // Slide up para el Bottom Sheet (formulario de crear/editar)
  slideUpBottomSheet(element: HTMLElement) {
    gsap.from(element, {
      y: '100%',
      opacity: 0.5,
      duration: 0.35,
      ease: "power3.out"
    });
  }

  // Animación de tachado animado (Strikethrough)
  // Nota: Requiere que el texto tenga un <span> interno o se aplique sobre un elemento de línea
  animateStrikethrough(element: HTMLElement) {
    // Simulamos un tachado animando el ancho de un pseudo-elemento o borde
    // Para Angular/Ionic, la forma más limpia es animar el width de un div superpuesto
    gsap.fromTo(element,
      { width: '0%' },
      { width: '100%', duration: 0.3, ease: "power1.inOut" }
    );
  }
}
