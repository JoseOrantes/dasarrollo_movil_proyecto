import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular';
import { IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { VerificacionFacialService } from '../../services/verificacion-facial.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    CommonModule, 
    FormsModule, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonButton, 
    RouterLink,
    HeaderComponent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader
  ],
})
export class InicioPage implements OnInit {
  nombre: string = 'Login';
  usuario = { 
    email: '',
    password: ''
  }
  verificando = signal(false);
  mensajeFacial = signal('');

  constructor(private verificacionFacial: VerificacionFacialService) { }

  ngOnInit() {
  }

  async verificarRostro() {
    this.verificando.set(true);
    this.mensajeFacial.set('');
    try {
      const resultado = await this.verificacionFacial.verificar();
      this.mensajeFacial.set(resultado.mensaje);
    } catch (err: any) {
      console.log('[VF] ERROR', JSON.stringify(err));
      this.mensajeFacial.set(`Error: ${err?.message ?? err}`);
    } finally {
      this.verificando.set(false);
    }
  }

  onSubmit( formulario: NgForm ) {
    console.log('submit');
    console.log(this.usuario);
    console.log(formulario);
  }
}
