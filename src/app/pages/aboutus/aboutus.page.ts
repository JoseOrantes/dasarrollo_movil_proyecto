import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
  imports: [IonContent, HeaderComponent],
})
export class AboutusPage {
  title = 'About us';
}
