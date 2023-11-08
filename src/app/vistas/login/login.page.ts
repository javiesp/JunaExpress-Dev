import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {FireserviceService} from 'src/app/fireservice.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  public email:any;
  public password: any;
  public apellido: any;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    public fireservice:FireserviceService,
    private alertController:AlertController 
  ) {}
  
  ngOnInit() {
  }

 // Esta función se ejecuta cuando se presiona el botón de inicio de sesión.
  async login() {
    if (!this.email || !this.password) {
      await this.presentAlert('Por favor, ingresa un correo electrónico y una contraseña.');
      return;
    }
    this.showLoading();
    try {
      const res = await this.fireservice.loginWithEmail({ email: this.email, password: this.password });
      console.log(res);
      if (res.user.uid) {
        this.fireservice.getDetails({ uid: res.user.uid }).subscribe(
          (res) => {
            console.log(res);
            this.loadingCtrl.dismiss();
            this.router.navigate(['/menu-principal']);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    } catch (err) {
      console.log(err);
      // Verifica el tipo de error para mostrar el mensaje adecuado
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        await this.presentAlert('Usuario o contraseña incorrectos');
      } else {
        await this.presentAlert('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo más tarde.');
      }
      this.loadingCtrl.dismiss();
    }
  }
  
  
  // Esta función se ejecuta cuando se presiona el botón de registro.
  // Redirige al usuario a la página de registro.
  signup() {
    this.router.navigate(['/registro']); // Redirige a la página de registro
  }

  // Esta función muestra un indicador de carga con un mensaje de "Iniciando Sesión...".
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      message: 'Iniciando Sesion...',
    });

    loading.present();
  }

  // Esta función muestra una alerta con un mensaje de error.
  // Se utiliza para mostrar mensajes de error al usuario.
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje de Error',
      message: message,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
  
}


