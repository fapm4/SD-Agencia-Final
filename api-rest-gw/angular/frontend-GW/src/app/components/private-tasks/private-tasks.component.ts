import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-private-tasks',
  templateUrl: './private-tasks.component.html',
  styleUrls: ['./private-tasks.component.css']
})
export class PrivateTasksComponent implements OnInit {

  proveedor = {
    nombreProveedor: ''
  }

  coleccion = {
    nombreColeccion: ''
  }

  objeto = {
    objeto: ''
  }

  idProveedor = {
    idProveedor: ''
  }

  idReserva = {
    idReserva: ''
  }

  usuario = {
    usuario: ''
  }
  constructor(public tasksService: TasksService) { }

  ngOnInit(): void {
  }

  postObjetoEnColeccion(proveedor:string, coleccion: string, objeto: string){
    this.tasksService.postObjetoEnColeccion(proveedor, coleccion, objeto)
    .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
  }

  putObjetoEnColeccion(proveedor:string, coleccion: string, objeto: string, idProv: string, idRev: string){
    this.tasksService.putObjetoEnColeccion(proveedor, coleccion, objeto, idProv, idRev)
    .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
  }

  deleteObjetoEnColeccion(proveedor:string, coleccion: string, idProv: string, idRev: string){
    this.tasksService.deleteObjetoEnColeccion(proveedor, coleccion, idProv, idRev)
    .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
  }

  deleteUser(user: string){
    this.tasksService.deleteUser(user)
    .subscribe(
      res => {
        console.log(res)
      },
      err => console.log(err)
    )
  }
}
