import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  uid: string;
  pedidos: any[];

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { 
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        console.log('uid usuario:', this.uid);
        this.db.list(`CarritoPedidos/${this.uid}`).valueChanges().subscribe((data: any[]) => {
          this.pedidos = data;
        });
      }
    });
  }

  ngOnInit() {
  }

  // Esta función elimina todos los pedidos asociados a un usuario específico en la base de datos.
  eliminarPedidosDelUsuario(usuarioID: string) {
     // Accede a la base de datos y elimina el nodo correspondiente a los pedidos del usuario.
    this.db.object(`CarritoPedidos/${usuarioID}`).remove()
      .then(() => {
        console.log('Pedidos del usuario eliminados exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar los pedidos del usuario:', error);
      });
  }
  

}
