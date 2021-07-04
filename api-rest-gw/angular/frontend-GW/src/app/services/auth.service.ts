import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { InciarSesionComponent } from '../components/inciar-sesion/inciar-sesion.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  miIp = "localhost";
  miPuerto = "3101";
  private URL = `https://${this.miIp}:${this.miPuerto}/api`;

  constructor(private http: HttpClient, private router: Router) { }

  registrar(user: any){
    return this.http.post<any>(this.URL + '/registrar', user);
  }

  iniciarSesion(user: InciarSesionComponent){
    const datos = {
      "user": `${user.getUser()}`,
      "password": `${user.getPassword()}`
    }
    
    return this.http.post<any>(this.URL + `/identificar/${user.getUser()}`, datos);
  }


  loggedIn(){
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  }
  
  getToken(){
    return "MITOKEN123456789";
  }

  logOut(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/iniciar']);
  }
}

