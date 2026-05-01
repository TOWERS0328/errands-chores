import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  /**
   * Abre la cámara del dispositivo para tomar una foto.
   * Aplica una compresión del 70% por defecto.
   */
  async takePhoto(): Promise<Photo | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 70, // Compresión de imagen antes de guardar (Requerimiento)
        allowEditing: false,
        resultType: CameraResultType.Base64, // Base64 es ideal para luego guardar en IndexedDB
        source: CameraSource.Camera
      });

      return image;
    } catch (error) {
      // Retorna null si el usuario cierra la cámara sin tomar la foto
      console.warn('Captura de foto cancelada o con error:', error);
      return null;
    }
  }

  /**
   * Abre la galería del dispositivo para seleccionar una imagen.
   */
  async pickFromGallery(): Promise<Photo | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 70, // Compresión
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      return image;
    } catch (error) {
      console.warn('Selección de galería cancelada o con error:', error);
      return null;
    }
  }

  /**
   * Utilidad para convertir el string Base64 devuelto por Capacitor
   * en una URL segura que se pueda usar directamente en la etiqueta <img> de Angular.
   */
  getWebSafeUrl(base64String: string, format: string = 'jpeg'): string {
    return `data:image/${format};base64,${base64String}`;
  }
}
