import { Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  // photo: SafeUrl | null = null;
  readonly photo = signal<SafeUrl | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  async takePhoto(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (!image.dataUrl) {
      throw new Error('La cámara no devolvió una foto.');
    }

    //this.photo = this.sanitizer.bypassSecurityTrustUrl(image.dataUrl);
    this.photo.set(this.sanitizer.bypassSecurityTrustUrl(image.dataUrl));
  }
}