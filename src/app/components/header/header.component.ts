import { Component, OnInit } from '@angular/core';
import { IonBackButton, IonHeader, IonIcon } from '@ionic/angular';
import { IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/angular';
import { Input } from '@angular/core'; 
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
import { AvatarService } from '../../services/avatar'; 
import { IonAvatar } from '@ionic/angular';

addIcons({ personCircleOutline });

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    RouterLink, 
    IonBackButton, 
    IonAvatar ],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = 'Inicio';
  @Input() showBack = false;
  @Input() showProfile = true; 
  @Input() translucent = true;

  constructor(public avatar: AvatarService) {}

  ngOnInit() {}
  takePhoto() {
    this.avatar.takePhoto();
  }
}

