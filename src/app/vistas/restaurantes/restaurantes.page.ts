import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { v4 as uuidv4 } from 'uuid'; // Importa uuidv4

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.page.html',
  styleUrls: ['./restaurantes.page.scss'],
})
export class RestaurantesPage implements OnInit {
  restaurantes: any[];
  menuRestaurante: any[];
  restauranteSeleccionado: any;
  isModalOpen: boolean;
  uid: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.db.list('restaurantes').valueChanges().subscribe((data: any[]) => {
      this.restaurantes = data;
    });

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        console.log('uid usuario:', this.uid);
      }
    });
  }

  // Función para generar un nuevo pedidoID
  generarPedidoID(): string {
    return uuidv4();
  }

  agregarAlCarrito(usuarioID: string, menu: any, restaurante: string) {
    const pedidoID = this.generarPedidoID(); // Genera un nuevo pedidoID usando la función
    const carritoItemRef = this.db.object(`CarritoPedidos/${usuarioID}/${pedidoID}`);
    carritoItemRef.update({ Menu: menu, Restaurante: restaurante });
  }

  getMenuRestaurante(restauranteId: string) {
    const restaurante = this.restaurantes.find((rest) => rest.id === restauranteId);
    if (restaurante) {
      this.restauranteSeleccionado = restaurante.nombre;
      this.menuRestaurante = restaurante.menu;
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ngOnInit() {}
}
