import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  puertoCoches = "3001";
  puertoVuelos = "3000";
  puertoHoteles = "3002";
  miIp = "192.168.0.9";
  miPuerto = "3101";

  private URL = `https://${this.miIp}:${this.miPuerto}/api`;
  constructor(private httpClient: HttpClient) { }

  getProveedores(){
    return this.httpClient.get<any>(this.URL);
  }

  getUsuarios(){
    return this.httpClient.get<any>(this.URL + "/usuarios");
  }

  getTablasDeProveedor(proveedor: string){
    return this.httpClient.get<any>(this.URL + `/${proveedor}`);
  }

  getDatosDeTabla(proveedor: string, coleccion: string){
    return this.httpClient.get<any>(this.URL + `/${proveedor}` + `/${coleccion}`);
  }

  getObjetoEspecifico(proveedor: string, coleccion: string, id: string){
    var newURL = `https://${this.miIp}:`;
    switch(proveedor){
      case "coche":
        newURL += `${this.puertoCoches}`;
        break;

      case "vuelo":
        newURL += `${this.puertoVuelos}`;
        break;

      case "hotel":
        newURL += `${this.puertoHoteles}`;
        break;
    }


    newURL += '/api' + `/${coleccion}` + `/${id}`;
    console.log(newURL);
    return this.httpClient.get<any>(newURL);
  }

  getReservasDeUsuario(proveedor: string, coleccion: string, id: string){
    var newURL = `https://${this.miIp}:`;
    switch(proveedor){
      case "coche":
        newURL += `${this.puertoCoches}`;
        break;

      case "vuelo":
        newURL += `${this.puertoVuelos}`;
        break;

      case "hotel":
        newURL += `${this.puertoHoteles}`;
        break;
    }

    newURL += '/api' + `/${coleccion}` + `/${id}`;
    return this.httpClient.get<any>(newURL);
  }

  postObjetoEnColeccion(proveedor:string, coleccion: string, objeto: string){
    var newURL = `https://${this.miIp}:`;
    switch(proveedor){
      case "coche":
        newURL += `${this.puertoCoches}`;
        break;

      case "vuelo":
        newURL += `${this.puertoVuelos}`;
        break;

      case "hotel":
        newURL += `${this.puertoHoteles}`;
        break;
    }

    console.log(objeto);
    newURL += '/api' + `/${coleccion}`;
    return this.httpClient.post<any>(newURL, JSON.parse(objeto));
  }

  putObjetoEnColeccion(proveedor:string, coleccion: string, objeto: string, idProv: string, idRev: string){
    const user = localStorage.getItem('user');
    var newURL = `https://${this.miIp}:`;
    switch(proveedor){
      case "coche":
        newURL += `${this.puertoCoches}`;
        break;

      case "vuelo":
        newURL += `${this.puertoVuelos}`;
        break;

      case "hotel":
        newURL += `${this.puertoHoteles}`;
        break;
    }


    console.log(objeto);
    newURL += '/api' + `/${proveedor}` + `/${coleccion}` + `/${idRev}`;
    console.log(newURL);
    return this.httpClient.put<any>(newURL, JSON.parse(objeto));
  }

  deleteObjetoEnColeccion(proveedor:string, coleccion: string, idProv: string, idRev: string){
    const user = localStorage.getItem('user');
    var newURL = `https://${this.miIp}:`;
    switch(proveedor){
      case "coche":
        newURL += `${this.puertoCoches}`;
        break;

      case "vuelo":
        newURL += `${this.puertoVuelos}`;
        break;

      case "hotel":
        newURL += `${this.puertoHoteles}`;
        break;
    }

    newURL += '/api' + `/${proveedor}` + `/${coleccion}` + `/${user}` + `/${idProv}`;
    console.log(newURL);
    return this.httpClient.post<any>(newURL, JSON.parse(idRev));
  }

  deleteUser(user: string){
    var newURL = `http://${this.miIp}:${this.miPuerto}/api/usuarios/${user}`;
    return this.httpClient.delete<any>(newURL);
  }
}
