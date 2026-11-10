import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
  imports: [CommonModule, IonAvatar, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class AvatarPage implements OnInit {

  userImage = "/assets/stan-lee.jpg";
  photo?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    console.log('image', image);
    if (!image.dataUrl) {
      throw new Error('Camera did not return an image data URL.');
    }
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.dataUrl);
  }

}