import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-public-tasks',
  templateUrl: './public-tasks.component.html',
  styleUrls: ['./public-tasks.component.css']
})
export class PublicTasksComponent implements OnInit {

  
  proveedores = {
    proveedor: ''
  }

  coleccion = {
    nombreColeccion: ''
  }

  id = {
    id: ''
  }

  dataProveedores: any = [];
  dataUsuarios: any = [];
  dataTablesProveedor: any = [];
  dataTableProveedorEspecifica: any = [];
  dataObjetoEspecifico: any = [];


  constructor(public tasksService: TasksService) { }

  ngOnInit(): void {
  }

  esReserva(){
    return this.coleccion.nombreColeccion == "reservas";
  }
  esCoche(){
    return this.coleccion.nombreColeccion == "coches";
  }
  esVuelo(){
    return this.coleccion.nombreColeccion == "vuelos";
  }
  esHotel(){
    return this.coleccion.nombreColeccion == "hoteles";
  }

  getProveedores(){
    this.tasksService.getProveedores()
    .subscribe(
      res => {
        console.log(res),
        this.dataProveedores = Object.values(res.proveedores);
        console.log(this.dataProveedores);
      },
      err => console.log(err)
    )
  }

  getUsuarios(){
    this.tasksService.getUsuarios()
    .subscribe(
      res => {
        console.log(res),
        this.dataUsuarios = Object.values(res.elementos);
        console.log(this.dataUsuarios);
      },
      err => console.log(err)
    )
  }

  getTablasDeProveedor(proveedor: string){
    this.tasksService.getTablasDeProveedor(proveedor)
    .subscribe(
      res => {
        console.log(res),
        this.dataTablesProveedor = Object.values(res.colecciones);
        console.log(this.dataTablesProveedor);
      },
      err => console.log(err)
    )
  }

  getDatosDeTabla(proveedor: string, coleccion: string){
    this.tasksService.getDatosDeTabla(proveedor, coleccion)
    .subscribe(
      res => {
        console.log(res),
        this.dataTableProveedorEspecifica = Object.values(res.elemento);
        console.log(this.dataTableProveedorEspecifica);
      },
      err => console.log(err)
    )
  }

  getObjetoEspecifico(proveedor: string, coleccion: string, id: string){
    this.tasksService.getObjetoEspecifico(proveedor, coleccion, id)
    .subscribe(
      res => {
        console.log(res),
        this.dataObjetoEspecifico = Object.values(res);
        console.log(this.dataObjetoEspecifico);
      },
      err => console.log(err)
    )
  }

  getReservasDeUsuario(proveedor: string, coleccion: string, id: string){
    this.tasksService.getReservasDeUsuario(proveedor, coleccion, id)
    .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
  }
}
